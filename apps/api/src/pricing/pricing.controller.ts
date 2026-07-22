import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { PricingService } from './pricing.service';
import { type IResolvedPricingContext } from './pricing.service';

@Controller('pricing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('quotes/:quoteId/context')
  @Roles('admin', 'engineer', 'sales')
  resolvePricingContext(
    @TenantContext() tenantContext: ITenantContext,
    @Param('quoteId') quoteId: string,
  ): Promise<IResolvedPricingContext> {
    return this.pricingService.resolvePricingContext(
      this.prismaService,
      tenantContext,
      quoteId,
    );
  }
}
