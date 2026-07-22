import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { AdvanceOrderDto } from './dto/advance-order.dto';
import { ConvertQuoteToOrderDto } from './dto/convert-quote-to-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('convert')
  @Roles('admin', 'sales')
  convert(@TenantContext() tenantContext: ITenantContext, @Body() dto: ConvertQuoteToOrderDto) {
    return this.ordersService.convertQuoteToOrder(tenantContext, dto);
  }

  @Post(':orderId/advance')
  @Roles('admin')
  advance(
    @TenantContext() tenantContext: ITenantContext,
    @Param('orderId') orderId: string,
    @Body() dto: AdvanceOrderDto,
  ) {
    return this.ordersService.advanceOrder(tenantContext, {
      ...dto,
      orderId,
    });
  }

  @Get()
  @Roles('admin', 'sales')
  list(@TenantContext() tenantContext: ITenantContext) {
    return this.ordersService.listOrders(tenantContext);
  }

  @Get(':orderId')
  @Roles('admin', 'sales')
  get(@TenantContext() tenantContext: ITenantContext, @Param('orderId') orderId: string) {
    return this.ordersService.getOrder(tenantContext, orderId);
  }
}
