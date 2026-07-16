import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BomModule } from './bom/bom.module';
import { CatalogModule } from './catalog/catalog.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { OrdersModule } from './orders/orders.module';
import { PricingModule } from './pricing/pricing.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuotesModule } from './quotes/quotes.module';
import { RulesModule } from './rules/rules.module';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CatalogModule,
    ConfigurationsModule,
    PricingModule,
    RulesModule,
    QuotesModule,
    BomModule,
    OrdersModule,
    ShipmentsModule,
  ],
})
export class AppModule {}
