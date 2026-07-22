import { Module } from '@nestjs/common';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { BillingModule } from './billing/billing.module';
import { TenantModule } from './tenant/tenant.module';
import { I18nModule } from './i18n/i18n.module';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    PlanModule,
    SubscriptionModule,
    BillingModule,
    TenantModule,
    I18nModule,
    FeatureModule,
  ],
  exports: [
    PlanModule,
    SubscriptionModule,
    BillingModule,
    TenantModule,
    I18nModule,
    FeatureModule,
  ],
})
export class PlatformModule {}
