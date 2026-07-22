import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SalesOrderStatus } from '@prisma/client';
import { SalesService } from './sales.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';

@Controller('erp/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('orders')
  createOrder(@Body() dto: CreateSalesOrderDto, @Query('tenantId') tenantId: string) {
    return this.salesService.createOrder(tenantId, dto);
  }

  @Get('orders')
  listOrders(
    @Query('tenantId') tenantId: string,
    @Query('status') status?: SalesOrderStatus,
  ) {
    return this.salesService.listOrders(tenantId, status);
  }

  @Patch('orders/:id/confirm')
  confirmOrder(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.salesService.confirmOrder(tenantId, id);
  }

  @Patch('orders/:id/cancel')
  cancelOrder(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.salesService.cancelOrder(tenantId, id);
  }
}
