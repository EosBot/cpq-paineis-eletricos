import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { FeatureService, FeatureFlag } from './feature.service';

@Controller('features')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get('check')
  @Roles('admin', 'engineer', 'sales')
  checkFeature(@TenantContext() tc: ITenantContext, @Query('feature') feature: FeatureFlag) {
    return this.featureService.hasFeature(tc.tenantId, feature);
  }

  @Get('limits')
  @Roles('admin', 'engineer', 'sales')
  getLimits(@TenantContext() tc: ITenantContext) {
    return this.featureService.getLimits(tc.tenantId);
  }

  @Get('subscription-active')
  @Roles('admin', 'engineer', 'sales')
  isSubscriptionActive(@TenantContext() tc: ITenantContext) {
    return this.featureService.isSubscriptionActive(tc.tenantId);
  }
}
