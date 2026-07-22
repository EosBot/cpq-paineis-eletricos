import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { BomModule } from './bom/bom.module';
import { CatalogModule } from './catalog/catalog.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { ErpModule } from './modules/erp/erp.module';
import { OrdersModule } from './orders/orders.module';
import { PlatformModule } from './modules/platform/platform.module';
import { PricingModule } from './pricing/pricing.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuotesModule } from './quotes/quotes.module';
import { RulesModule } from './rules/rules.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { PanelBuilderModule } from './modules/panel-builder/panel-builder.module';
import { PrivacyModule } from './modules/privacy/privacy.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { HealthController } from './common/health/health.controller';
import { TenantScopeInterceptor } from './tenancy/tenant-scope.interceptor';
import { CorrelationIdInterceptor } from './common/correlation-id/correlation-id.interceptor';
import { TestModule } from './test/test.module';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 20,
      },
    ]),
    PrismaModule,
    AuthModule,
    AuditModule,
    CatalogModule,
    ConfigurationsModule,
    PricingModule,
    RulesModule,
    QuotesModule,
    BomModule,
    OrdersModule,
    ShipmentsModule,
    PlatformModule,
    ErpModule,
    SuperAdminModule,
    PrivacyModule,
    PanelBuilderModule,
    MarketplaceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantScopeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
