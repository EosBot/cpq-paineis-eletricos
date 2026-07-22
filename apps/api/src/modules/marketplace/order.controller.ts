import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { MarketplaceOrderService } from './order.service';
import { CreateOrderDto } from './dto/marketplace.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MarketplaceOrderController {
  constructor(private readonly orderService: MarketplaceOrderService) {}

  @Get()
  @Roles('admin', 'engineer', 'sales')
  getOrders(
    @TenantContext() tc: ITenantContext,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.getOrders(tc, {
      status,
      customerId,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  @Roles('admin', 'engineer', 'sales')
  getById(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.orderService.getById(tc, id);
  }

  @Post('checkout')
  @Roles('admin', 'engineer', 'sales')
  async checkout(@TenantContext() tc: ITenantContext, @Body() dto: CreateOrderDto, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.orderService.createFromCart(tc, customerId, dto);
  }

  @Patch(':id/advance')
  @Roles('admin', 'sales')
  advanceStatus(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.orderService.advanceStatus(tc, id);
  }

  @Patch(':id/cancel')
  @Roles('admin', 'sales')
  cancel(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.orderService.cancel(tc, id);
  }
}
