import { Injectable, NotFoundException } from '@nestjs/common';
import { QuoteStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';

@Injectable()
export class BuilderIntegrationService {
  constructor(private readonly prisma: PrismaService) {}

  async convertBuilderToConfiguration(
    @TenantContext() tc: ITenantContext,
    data: {
      configurationId: string;
      customerAccountId: string;
      quoteTitle: string;
    },
  ) {
    return this.prisma.$transactionWithRLS(tc.tenantId, async (tx) => {
      const config = await tx.configuration.findFirst({
        where: { id: data.configurationId, tenantId: tc.tenantId },
        include: { placements: true, rails: true, circuits: true },
      });
      if (!config) throw new NotFoundException('Configuration not found');

      const quote = await tx.quote.create({
        data: {
          tenantId: tc.tenantId,
          customerAccountId: data.customerAccountId,
          createdByUserId: tc.userId,
          quoteNumber: `QUOTE-${Date.now()}`,
          title: data.quoteTitle,
          status: QuoteStatus.DRAFT,
          currencyCode: 'BRL',
        },
      });

      await tx.configuration.update({
        where: { id: config.id },
        data: { quoteId: quote.id },
      });

      for (const placement of config.placements) {
        await tx.configurationItem.create({
          data: {
            tenantId: tc.tenantId,
            configurationId: config.id,
            componentId: placement.componentId,
            quantity: new Prisma.Decimal(placement.quantity),
            positionKey: `${placement.railId}:${placement.positionMm}`,
            metadata: { circuitId: placement.circuitId, moduleWidth: placement.moduleWidth } as Prisma.InputJsonValue,
          },
        });
      }

      return { configurationId: config.id, quoteId: quote.id, quoteNumber: quote.quoteNumber };
    });
  }

  async submitConfigurationForReview(
    @TenantContext() tc: ITenantContext,
    configurationId: string,
  ) {
    return this.prisma.$transactionWithRLS(tc.tenantId, async (tx) => {
      const configuration = await tx.configuration.findFirst({
        where: { id: configurationId, tenantId: tc.tenantId },
        include: {
          placements: true,
          rails: true,
          circuits: true,
          snapshots: { orderBy: { versionNumber: 'desc' }, take: 1 },
        },
      });
      if (!configuration) throw new NotFoundException('Configuration not found');

      const nextVersionNumber = (configuration.snapshots[0]?.versionNumber ?? 0) + 1;

      const snapshotData = {
        configuration: {
          id: configuration.id,
          name: configuration.name,
          panelType: configuration.panelType,
          enclosure: {
            widthMm: configuration.enclosureWidthMm,
            heightMm: configuration.enclosureHeightMm,
            depthMm: configuration.enclosureDepthMm,
            material: configuration.enclosureMaterial,
            ipRating: configuration.ipRating,
          },
          electrical: {
            supplyVoltage: configuration.supplyVoltage,
            supplyPhases: configuration.supplyPhases,
            totalLoadA: configuration.totalLoadA,
            shortCircuitRating: configuration.shortCircuitRating,
          },
          environment: {
            stateCode: configuration.stateCode,
            ambientTempC: configuration.ambientTempC,
            indoorOutdoor: configuration.indoorOutdoor,
          },
        },
        rails: configuration.rails.map((r) => ({
          id: r.id, type: r.railType, lengthMm: r.lengthMm, positionY: r.positionY.toNumber(), moduleCapacity: r.moduleCapacity, usedModules: r.usedModules,
        })),
        circuits: configuration.circuits.map((c) => ({
          id: c.id, name: c.name, type: c.circuitType, voltage: c.voltage, color: c.color,
        })),
        placements: configuration.placements.map((p) => ({
          id: p.id, componentId: p.componentId, railId: p.railId, circuitId: p.circuitId, positionMm: p.positionMm.toNumber(), moduleWidth: p.moduleWidth, quantity: p.quantity,
        })),
        submittedAt: new Date().toISOString(),
      };

      const snapshot = await tx.configurationSnapshot.create({
        data: {
          tenantId: tc.tenantId,
          configurationId: configuration.id,
          versionNumber: nextVersionNumber,
          snapshotData: snapshotData as Prisma.InputJsonValue,
        },
      });

      await tx.configuration.update({ where: { id: configuration.id }, data: { status: QuoteStatus.INTERNAL_REVIEW } });

      if (configuration.quoteId) {
        await tx.quote.update({ where: { id: configuration.quoteId }, data: { status: QuoteStatus.INTERNAL_REVIEW } });
      }

      return snapshot;
    });
  }

  async getQuoteWithConfiguration(@TenantContext() tc: ITenantContext, quoteId: string) {
    return this.prisma.quote.findFirst({
      where: { id: quoteId, tenantId: tc.tenantId },
      include: {
        configuration: {
          include: {
            snapshots: { orderBy: { versionNumber: 'desc' }, take: 1 },
            placements: { include: { component: true } },
            rails: true,
            circuits: true,
          },
        },
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });
  }
}
