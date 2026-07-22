import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';

@Injectable()
export class PanelBuilderService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(@TenantContext() tc: ITenantContext, filters?: { categoryCode?: string; search?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.ComponentWhereInput = { tenantId: tc.tenantId, isActive: true };
    if (filters?.categoryCode) {
      where.componentCategory = { code: filters.categoryCode };
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [components, total] = await Promise.all([
      this.prisma.component.findMany({
        where,
        skip,
        take: limit,
        include: {
          componentCategory: { select: { id: true, code: true, name: true } },
        },
        orderBy: { componentCategoryId: 'asc' },
      }),
      this.prisma.component.count({ where }),
    ]);

    return { data: components, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getCategories(@TenantContext() tc: ITenantContext) {
    return this.prisma.componentCategory.findMany({
      where: { tenantId: tc.tenantId },
      orderBy: { name: 'asc' },
      include: { _count: { select: { components: true } } },
    });
  }

  async getPanelTemplates() {
    return this.prisma.panelTemplate.findMany({
      where: { isActive: true },
      orderBy: { complexity: 'asc' },
    });
  }

  async getRegions() {
    return this.prisma.region.findMany({ orderBy: { stateName: 'asc' } });
  }

  async getRegionByState(stateCode: string) {
    return this.prisma.region.findUnique({ where: { stateCode } });
  }

  async createConfiguration(
    @TenantContext() tc: ITenantContext,
    data: {
      name: string;
      panelType: string;
      enclosureWidthMm: number;
      enclosureHeightMm: number;
      enclosureDepthMm: number;
      enclosureMaterial: string;
      ipRating: string;
      supplyVoltage: string;
      supplyPhases: number;
      stateCode: string;
      ambientTempC: number;
      indoorOutdoor: string;
    },
  ) {
    return this.prisma.configuration.create({
      data: {
        tenantId: tc.tenantId,
        name: data.name,
        panelType: data.panelType,
        enclosureWidthMm: data.enclosureWidthMm,
        enclosureHeightMm: data.enclosureHeightMm,
        enclosureDepthMm: data.enclosureDepthMm,
        enclosureMaterial: data.enclosureMaterial,
        ipRating: data.ipRating,
        supplyVoltage: data.supplyVoltage,
        supplyPhases: data.supplyPhases,
        stateCode: data.stateCode,
        ambientTempC: data.ambientTempC,
        indoorOutdoor: data.indoorOutdoor,
        status: 'DRAFT',
      },
    });
  }

  async getConfigurations(@TenantContext() tc: ITenantContext) {
    return this.prisma.configuration.findMany({
      where: { tenantId: tc.tenantId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { rails: true, circuits: true, placements: true } } },
    });
  }

  async getConfiguration(@TenantContext() tc: ITenantContext, id: string) {
    const config = await this.prisma.configuration.findFirst({
      where: { id, tenantId: tc.tenantId },
      include: {
        rails: { orderBy: { sortOrder: 'asc' } },
        circuits: { orderBy: { sortOrder: 'asc' } },
        placements: {
          include: { component: { select: { id: true, name: true, sku: true, moduleWidth: true, typicalPrice: true, formFactorGroup: true } } },
        },
      },
    });
    if (!config) throw new NotFoundException('Configuration not found');
    return config;
  }

  async addRail(
    @TenantContext() tc: ITenantContext,
    configurationId: string,
    data: { railType: string; lengthMm: number; positionY: number; label?: string },
  ) {
    const config = await this.prisma.configuration.findFirst({ where: { id: configurationId, tenantId: tc.tenantId } });
    if (!config) throw new NotFoundException('Configuration not found');

    const moduleCapacity = Math.floor(data.lengthMm / 18);
    return this.prisma.dINRail.create({
      data: {
        configurationId,
        railType: data.railType,
        lengthMm: data.lengthMm,
        positionY: new Prisma.Decimal(data.positionY),
        moduleCapacity,
        label: data.label,
      },
    });
  }

  async addCircuit(
    @TenantContext() tc: ITenantContext,
    configurationId: string,
    data: { name: string; circuitType: string; voltage: string; color: string },
  ) {
    const config = await this.prisma.configuration.findFirst({ where: { id: configurationId, tenantId: tc.tenantId } });
    if (!config) throw new NotFoundException('Configuration not found');

    return this.prisma.circuit.create({
      data: { configurationId, name: data.name, circuitType: data.circuitType, voltage: data.voltage, color: data.color },
    });
  }

  async addPlacement(
    @TenantContext() tc: ITenantContext,
    configurationId: string,
    data: { componentId: string; railId: string; circuitId?: string; positionMm: number; moduleWidth: number },
  ) {
    const config = await this.prisma.configuration.findFirst({ where: { id: configurationId, tenantId: tc.tenantId } });
    if (!config) throw new NotFoundException('Configuration not found');

    return this.prisma.componentPlacement.create({
      data: { configurationId, componentId: data.componentId, railId: data.railId, circuitId: data.circuitId, positionMm: new Prisma.Decimal(data.positionMm), moduleWidth: data.moduleWidth },
    });
  }

  async removePlacement(@TenantContext() tc: ITenantContext, placementId: string) {
    return this.prisma.componentPlacement.deleteMany({ where: { id: placementId, configuration: { tenantId: tc.tenantId } } });
  }

  async calculatePricing(@TenantContext() tc: ITenantContext, configurationId: string) {
    const config = await this.prisma.configuration.findFirst({
      where: { id: configurationId, tenantId: tc.tenantId },
      include: { placements: { include: { component: true } }, rails: true },
    });
    if (!config) throw new NotFoundException('Configuration not found');

    const componentCost = config.placements.reduce((sum, p) => sum + (p.component.typicalPrice?.toNumber() ?? 0) * p.quantity, 0);
    const laborHours = Math.max(4, config.placements.length * 0.3 + config.rails.length * 0.5);
    const laborRate = 75;
    const laborCost = laborHours * laborRate;
    const subtotal = componentCost + laborCost;
    const overhead = subtotal * 0.15;
    const total = subtotal + overhead;

    return {
      componentCost: Math.round(componentCost * 100) / 100,
      laborHours: Math.round(laborHours * 10) / 10,
      laborRate,
      laborCost: Math.round(laborCost * 100) / 100,
      overhead: Math.round(overhead * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      total: Math.round(total * 100) / 100,
      componentCount: config.placements.length,
    };
  }

  async getBusinessRules(@TenantContext() tc: ITenantContext) {
    return this.prisma.businessRule.findMany({
      where: { tenantId: tc.tenantId, isActive: true },
      orderBy: { priority: 'asc' },
    });
  }
}
