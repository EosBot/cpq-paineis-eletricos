import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/marketplace.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  async getCart(@TenantContext() tc: ITenantContext, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.cartService.getCart(tc, customerId);
  }

  @Get('summary')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  async getCartSummary(@TenantContext() tc: ITenantContext, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.cartService.getCartSummary(tc, customerId);
  }

  @Post('items')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  async addItem(@TenantContext() tc: ITenantContext, @Body() dto: AddToCartDto, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.cartService.addItem(tc, dto, customerId);
  }

  @Patch('items/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  async updateItem(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() dto: UpdateCartItemDto, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.cartService.updateItem(tc, id, dto, customerId);
  }

  @Delete('items/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  async removeItem(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.cartService.removeItem(tc, id, customerId);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  async clearCart(@TenantContext() tc: ITenantContext, @Req() req: any) {
    const customerId = req.user?.customerId;
    return this.cartService.clearCart(tc, customerId);
  }
}
