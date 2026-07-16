import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { AdvanceOrderDto } from './dto/advance-order.dto';
import { ConvertQuoteToOrderDto } from './dto/convert-quote-to-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('convert')
  @Roles('admin', 'sales')
  convert(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: ConvertQuoteToOrderDto,
  ) {
    return this.ordersService.convertQuoteToOrder(createTenantContext(tenantId, userId), dto);
  }

  @Post(':orderId/advance')
  @Roles('admin')
  advance(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('orderId') orderId: string,
    @Body() dto: AdvanceOrderDto,
  ) {
    return this.ordersService.advanceOrder(createTenantContext(tenantId, userId), {
      ...dto,
      orderId,
    });
  }

  @Get()
  @Roles('admin', 'sales')
  list(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string) {
    return this.ordersService.listOrders(createTenantContext(tenantId, userId));
  }

  @Get(':orderId')
  @Roles('admin', 'sales')
  get(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.getOrder(createTenantContext(tenantId, userId), orderId);
  }
}
