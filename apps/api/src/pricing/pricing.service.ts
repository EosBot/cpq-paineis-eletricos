import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';

export interface IResolvedPricingContext {
  source: 'COMMERCIAL_CONTRACT' | 'TENANT_DEFAULT';
  currencyCode: string;
  pricingContext: unknown;
  commercialContractId: string | null;
}

@Injectable()
export class PricingService {
  constructor(private readonly prismaService: PrismaService) {}

  async resolvePricingContext(
    tenantContext: ITenantContext,
    quoteId: string,
  ): Promise<IResolvedPricingContext> {
    const quote = await this.prismaService.quote.findFirstOrThrow({
      where: {
        id: quoteId,
        tenantId: tenantContext.tenantId,
      },
      include: {
        tenant: true,
        commercialContract: true,
      },
    });

    if (quote.commercialContract) {
      return {
        source: 'COMMERCIAL_CONTRACT',
        currencyCode: quote.commercialContract.currencyCode,
        pricingContext: quote.commercialContract.pricingContext,
        commercialContractId: quote.commercialContract.id,
      };
    }

    return {
      source: 'TENANT_DEFAULT',
      currencyCode: quote.tenant.defaultCurrency,
      pricingContext: quote.tenant.defaultPricingContext ?? {},
      commercialContractId: null,
    };
  }
}
