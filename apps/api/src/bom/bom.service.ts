import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { GenerateBomVersionDto } from './dto/generate-bom-version.dto';

interface SnapshotItem {
  id?: string;
  componentId?: string;
  quantity?: string;
  positionKey?: string | null;
  metadata?: unknown;
}

@Injectable()
export class BomService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateBomVersion(tenantContext: ITenantContext, dto: GenerateBomVersionDto) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    const snapshot = await this.prismaService.configurationSnapshot.findFirstOrThrow({
      where: {
        id: dto.configurationSnapshotId,
        tenantId: tenantContext.tenantId,
      },
    });

    const rawItems =
      (snapshot.snapshotData as { items?: SnapshotItem[] } | undefined)?.items ?? [];
    const componentIds = rawItems
      .map((item) => item.componentId)
      .filter((id): id is string => Boolean(id));

    const components = componentIds.length
      ? await this.prismaService.component.findMany({
          where: { id: { in: componentIds }, tenantId: tenantContext.tenantId },
          select: { id: true, sku: true, name: true },
        })
      : [];
    const componentById = new Map(components.map((component) => [component.id, component]));

    const lines = rawItems.map((item, index) => {
      const component = item.componentId ? componentById.get(item.componentId) : undefined;
      return {
        lineIndex: index + 1,
        componentId: item.componentId ?? null,
        sku: component?.sku ?? null,
        name: component?.name ?? null,
        quantity: item.quantity ?? null,
        positionKey: item.positionKey ?? null,
        metadata: item.metadata ?? null,
      };
    });

    const lastVersion = await this.prismaService.bOMVersion.findFirst({
      where: { quoteId: dto.quoteId, tenantId: tenantContext.tenantId },
      orderBy: { versionNumber: 'desc' },
    });
    const versionNumber = (lastVersion?.versionNumber ?? 0) + 1;

    const bomData = {
      generatedAt: new Date().toISOString(),
      lineCount: lines.length,
      lines,
    };

    return this.prismaService.bOMVersion.create({
      data: {
        tenantId: tenantContext.tenantId,
        quoteId: dto.quoteId,
        quoteVersionId: dto.quoteVersionId,
        configurationSnapshotId: dto.configurationSnapshotId,
        versionNumber,
        bomData: bomData as Prisma.InputJsonValue,
      },
    });
  }

  async listBomVersions(tenantContext: ITenantContext, quoteId?: string) {
    return this.prismaService.bOMVersion.findMany({
      where: {
        tenantId: tenantContext.tenantId,
        ...(quoteId ? { quoteId } : {}),
      },
      orderBy: [{ quoteId: 'asc' }, { versionNumber: 'desc' }],
    });
  }
}
