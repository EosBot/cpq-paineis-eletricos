import { Injectable } from '@nestjs/common';
import {
  Prisma,
  QuoteStatus,
  QuoteVersionTrigger,
  RuleVersionStatus,
} from '@prisma/client';
import { BomService } from '../bom/bom.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { CustomerApproveQuoteDto } from './dto/customer-approve-quote.dto';
import { ReopenQuoteDto } from './dto/reopen-quote.dto';
import { SendQuoteDto } from './dto/send-quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pricingService: PricingService,
    private readonly bomService: BomService,
  ) {}

  async createQuote(tenantContext: ITenantContext, dto: CreateQuoteDto) {
    return this.prismaService.quote.create({
      data: {
        tenantId: tenantContext.tenantId,
        customerAccountId: dto.customerAccountId,
        primaryContactId: dto.primaryContactId,
        commercialContractId: dto.commercialContractId,
        createdByUserId: tenantContext.userId ?? dto.createdByUserId,
        quoteNumber: dto.quoteNumber,
        title: dto.title,
        status: QuoteStatus.DRAFT,
        currencyCode: dto.currencyCode,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  async listQuotes(tenantContext: ITenantContext) {
    return this.prismaService.quote.findMany({
      where: {
        tenantId: tenantContext.tenantId,
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async calculateQuoteVersion(tenantContext: ITenantContext, quoteId: string) {
    const quoteVersion = await this.prismaService.$transaction(async (transaction) => {
      const quote = await transaction.quote.findFirstOrThrow({
        where: {
          id: quoteId,
          tenantId: tenantContext.tenantId,
        },
        include: {
          configuration: {
            include: {
              snapshots: {
                orderBy: {
                  versionNumber: 'desc',
                },
                take: 1,
              },
              items: true,
            },
          },
          versions: {
            orderBy: {
              versionNumber: 'desc',
            },
            take: 1,
          },
        },
      });

      const configurationSnapshot = quote.configuration?.snapshots[0];

      if (!configurationSnapshot) {
        throw new Error('Configuration snapshot is required before calculation.');
      }

      const pricingContext = await this.pricingService.resolvePricingContext(
        tenantContext,
        quote.id,
      );

      const approvedRuleVersions = await transaction.ruleVersion.findMany({
        where: {
          tenantId: tenantContext.tenantId,
          status: RuleVersionStatus.APPROVED,
        },
        orderBy: [{ ruleId: 'asc' }, { versionNumber: 'desc' }],
      });

      const latestApprovedPerRule = new Map<string, (typeof approvedRuleVersions)[number]>();

      for (const ruleVersion of approvedRuleVersions) {
        if (!latestApprovedPerRule.has(ruleVersion.ruleId)) {
          latestApprovedPerRule.set(ruleVersion.ruleId, ruleVersion);
        }
      }

      const versionNumber = (quote.versions[0]?.versionNumber ?? 0) + 1;
      const itemCount = quote.configuration?.items.length ?? 0;
      const totalsSnapshot = {
        itemCount,
        currencyCode: pricingContext.currencyCode,
      };

      const quoteVersion = await transaction.quoteVersion.create({
        data: {
          tenantId: tenantContext.tenantId,
          quoteId: quote.id,
          configurationSnapshotId: configurationSnapshot.id,
          versionNumber,
          trigger: QuoteVersionTrigger.CALCULATION,
          pricingSnapshot: {
            source: pricingContext.source,
            commercialContractId: pricingContext.commercialContractId,
            pricingContext: pricingContext.pricingContext,
          } as Prisma.InputJsonValue,
          totalsSnapshot: totalsSnapshot as Prisma.InputJsonValue,
          appliedRuleVersions: {
            create: Array.from(latestApprovedPerRule.values()).map((ruleVersion) => ({
              ruleVersionId: ruleVersion.id,
            })),
          },
        },
        include: {
          appliedRuleVersions: true,
        },
      });

      await transaction.quote.update({
        where: {
          id: quote.id,
        },
        data: {
          status: QuoteStatus.CALCULATED,
          currencyCode: pricingContext.currencyCode,
        },
      });

      return quoteVersion;
    });

    await this.bomService.generateBomVersion(tenantContext, {
      quoteId: quoteVersion.quoteId,
      quoteVersionId: quoteVersion.id,
      configurationSnapshotId: quoteVersion.configurationSnapshotId,
    });

    return quoteVersion;
  }

  async sendQuote(tenantContext: ITenantContext, dto: SendQuoteDto) {
    return this.prismaService.quote.update({
      where: {
        id: dto.quoteId,
      },
      data: {
        status: QuoteStatus.SENT,
        sentAt: new Date(),
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async customerApproveQuote(
    tenantContext: ITenantContext,
    dto: CustomerApproveQuoteDto,
  ) {
    return this.prismaService.quote.update({
      where: {
        id: dto.quoteId,
      },
      data: {
        status: QuoteStatus.CUSTOMER_APPROVED,
        customerApprovedAt: new Date(),
      },
    });
  }

  async reopenQuote(tenantContext: ITenantContext, dto: ReopenQuoteDto) {
    return this.prismaService.$transaction(async (transaction) => {
      const quote = await transaction.quote.findFirstOrThrow({
        where: {
          id: dto.quoteId,
          tenantId: tenantContext.tenantId,
        },
        include: {
          configuration: {
            include: {
              snapshots: {
                orderBy: {
                  versionNumber: 'desc',
                },
                take: 1,
              },
            },
          },
          versions: {
            orderBy: {
              versionNumber: 'desc',
            },
            take: 1,
          },
        },
      });

      const configurationSnapshot = quote.configuration?.snapshots[0];

      if (!configurationSnapshot) {
        throw new Error('Configuration snapshot is required to reopen a quote.');
      }

      const versionNumber = (quote.versions[0]?.versionNumber ?? 0) + 1;

      const quoteVersion = await transaction.quoteVersion.create({
        data: {
          tenantId: tenantContext.tenantId,
          quoteId: quote.id,
          configurationSnapshotId: configurationSnapshot.id,
          versionNumber,
          trigger: QuoteVersionTrigger.REOPEN,
          pricingSnapshot: {
            reason: dto.reason,
            reopenedByUserId: tenantContext.userId ?? null,
          } as Prisma.InputJsonValue,
          totalsSnapshot: {} as Prisma.InputJsonValue,
        },
      });

      await transaction.quote.update({
        where: {
          id: quote.id,
        },
        data: {
          status: QuoteStatus.DRAFT,
          expiredAt: null,
          customerApprovedAt: null,
          rejectedAt: null,
          sentAt: null,
        },
      });

      await transaction.configuration.updateMany({
        where: {
          quoteId: quote.id,
          tenantId: tenantContext.tenantId,
        },
        data: {
          status: QuoteStatus.DRAFT,
        },
      });

      return quoteVersion;
    });
  }
}
