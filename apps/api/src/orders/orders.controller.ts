import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { OrdersService } from './orders.service';
import { MarketplaceOrderService } from '../modules/marketplace/order.service';
import { AdvanceOrderDto } from './dto/advance-order.dto';
import { ConvertQuoteToOrderDto } from './dto/convert-quote-to-order.dto';
import { CreateOrderDto } from '../modules/marketplace/dto/marketplace.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly marketplaceOrderService: MarketplaceOrderService,
  ) {}

  // ── CPQ Routes ──

  @Post('convert')
  @Roles('admin', 'sales')
  convert(@TenantContext() tc: ITenantContext, @Body() dto: ConvertQuoteToOrderDto) {
    return this.ordersService.convertQuoteToOrder(tc, dto);
  }

  // ── Marketplace Cart Checkout ──

  @Post('checkout')
  @Roles('admin', 'engineer', 'sales')
  async checkout(@TenantContext() tc: ITenantContext, @Body() dto: CreateOrderDto, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.marketplaceOrderService.createFromCart(tc, customerId, dto);
  }

  // ── Shared Order Operations ──

  @Get()
  @Roles('admin', 'engineer', 'sales')
  getOrders(
    @TenantContext() tc: ITenantContext,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.marketplaceOrderService.getOrders(tc, {
      status,
      customerId,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':orderId')
  @Roles('admin', 'engineer', 'sales')
  getById(@TenantContext() tc: ITenantContext, @Param('orderId') orderId: string) {
    return this.marketplaceOrderService.getById(tc, orderId);
  }

  @Patch(':orderId/advance')
  @Roles('admin', 'sales')
  advanceStatus(
    @TenantContext() tc: ITenantContext,
    @Param('orderId') orderId: string,
    @Body() dto: AdvanceOrderDto,
  ) {
    return this.marketplaceOrderService.advanceStatus(tc, orderId);
  }

  @Patch(':orderId/cancel')
  @Roles('admin', 'sales')
  cancel(@TenantContext() tc: ITenantContext, @Param('orderId') orderId: string) {
    return this.marketplaceOrderService.cancel(tc, orderId);
  }
}
