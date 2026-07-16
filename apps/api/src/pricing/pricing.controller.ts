import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { PricingService } from './pricing.service';
import { type IResolvedPricingContext } from './pricing.service';

@Controller('pricing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('quotes/:quoteId/context')
  @Roles('admin', 'engineer', 'sales')
  resolvePricingContext(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('quoteId') quoteId: string,
  ): Promise<IResolvedPricingContext> {
    return this.pricingService.resolvePricingContext(
      createTenantContext(tenantId, userId),
      quoteId,
    );
  }
}
