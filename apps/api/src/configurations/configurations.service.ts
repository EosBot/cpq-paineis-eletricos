import { Injectable } from '@nestjs/common';
import { QuoteStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { SubmitConfigurationForReviewDto } from './dto/submit-configuration-for-review.dto';

@Injectable()
export class ConfigurationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createConfiguration(
    tenantContext: ITenantContext,
    dto: CreateConfigurationDto,
  ) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    return this.prismaService.configuration.create({
      data: {
        tenantId: tenantContext.tenantId,
        quoteId: dto.quoteId,
        name: dto.name,
        status: QuoteStatus.DRAFT,
        graphData:
          dto.graphData === undefined
            ? Prisma.JsonNull
            : (dto.graphData as Prisma.InputJsonValue),
        items: {
          create: dto.items.map((item) => ({
            tenantId: tenantContext.tenantId,
            componentId: item.componentId,
            quantity: new Prisma.Decimal(item.quantity),
            positionKey: item.positionKey,
            metadata:
              item.metadata === undefined
                ? Prisma.JsonNull
                : (item.metadata as Prisma.InputJsonValue),
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async listConfigurations(tenantContext: ITenantContext) {
    return this.prismaService.configuration.findMany({
      where: {
        tenantId: tenantContext.tenantId,
      },
      include: {
        items: true,
        snapshots: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async submitForInternalReview(
    tenantContext: ITenantContext,
    dto: SubmitConfigurationForReviewDto,
  ) {
    return this.prismaService.$transactionWithRLS(tenantContext.tenantId, async (transaction) => {
      const configuration = await transaction.configuration.findFirstOrThrow({
        where: {
          id: dto.configurationId,
          tenantId: tenantContext.tenantId,
        },
        include: {
          items: true,
          snapshots: {
            orderBy: {
              versionNumber: 'desc',
            },
            take: 1,
          },
          quote: true,
        },
      });

      const nextVersionNumber = (configuration.snapshots[0]?.versionNumber ?? 0) + 1;

      const snapshotData = {
        configuration: {
          id: configuration.id,
          name: configuration.name,
          status: QuoteStatus.INTERNAL_REVIEW,
          graphData: configuration.graphData,
        },
        items: configuration.items.map((item) => ({
          id: item.id,
          componentId: item.componentId,
          quantity: item.quantity.toString(),
          positionKey: item.positionKey,
          metadata: item.metadata,
        })),
        submittedAt: new Date().toISOString(),
      };

      const snapshot = await transaction.configurationSnapshot.create({
        data: {
          tenantId: tenantContext.tenantId,
          configurationId: configuration.id,
          versionNumber: nextVersionNumber,
          snapshotData: snapshotData as Prisma.InputJsonValue,
        },
      });

      await transaction.configuration.update({
        where: {
          id: configuration.id,
        },
        data: {
          status: QuoteStatus.INTERNAL_REVIEW,
        },
      });

      if (configuration.quoteId) {
        await transaction.quote.update({
          where: {
            id: configuration.quoteId,
          },
          data: {
            status: QuoteStatus.INTERNAL_REVIEW,
          },
        });
      }

      return snapshot;
    });
  }
}
