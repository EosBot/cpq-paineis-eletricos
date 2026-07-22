import { Controller, Get, Query } from '@nestjs/common';
import { FeatureService, FeatureFlag } from './feature.service';

@Controller('features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get('check')
  checkFeature(
    @Query('tenantId') tenantId: string,
    @Query('feature') feature: FeatureFlag,
  ) {
    return this.featureService.hasFeature(tenantId, feature);
  }

  @Get('limits')
  getLimits(@Query('tenantId') tenantId: string) {
    return this.featureService.getLimits(tenantId);
  }

  @Get('subscription-active')
  isSubscriptionActive(@Query('tenantId') tenantId: string) {
    return this.featureService.isSubscriptionActive(tenantId);
  }
}
