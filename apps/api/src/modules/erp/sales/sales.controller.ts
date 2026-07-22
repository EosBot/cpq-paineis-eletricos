import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SalesOrderStatus } from '@prisma/client';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { SalesService } from './sales.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';

@Controller('erp/sales')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('orders')
  @Roles('admin', 'sales')
  createOrder(@TenantContext() tc: ITenantContext, @Body() dto: CreateSalesOrderDto) {
    return this.salesService.createOrder(tc.tenantId, dto);
  }

  @Get('orders')
  @Roles('admin', 'engineer', 'sales')
  listOrders(
    @TenantContext() tc: ITenantContext,
    @Query('status') status?: SalesOrderStatus,
  ) {
    return this.salesService.listOrders(tc.tenantId, status);
  }

  @Patch('orders/:id/confirm')
  @Roles('admin', 'sales')
  confirmOrder(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.salesService.confirmOrder(tc.tenantId, id);
  }

  @Patch('orders/:id/cancel')
  @Roles('admin')
  cancelOrder(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.salesService.cancelOrder(tc.tenantId, id);
  }
}
