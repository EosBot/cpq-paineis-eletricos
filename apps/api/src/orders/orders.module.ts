import { Module } from '@nestjs/common';
import { BomModule } from '../bom/bom.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketplaceModule } from '../modules/marketplace/marketplace.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule, BomModule, MarketplaceModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
