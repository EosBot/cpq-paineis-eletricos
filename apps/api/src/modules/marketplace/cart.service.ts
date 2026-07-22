import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { AddToCartDto, UpdateCartItemDto } from './dto/marketplace.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(tc: ITenantContext, customerId?: string, sessionId?: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        OR: [
          { customerId: customerId || undefined },
          { sessionId: sessionId || undefined },
        ],
        status: 'ACTIVE',
      },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
            },
            configuration: {
              select: { id: true, name: true, status: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return this.prisma.cart.create({
        data: {
          customerId,
          sessionId,
          status: 'ACTIVE',
          items: { create: [] },
        },
        include: { items: true },
      });
    }

    return cart;
  }

  async addItem(tc: ITenantContext, dto: AddToCartDto, customerId?: string, sessionId?: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, tenantId: tc.tenantId, isActive: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const cart = await this.getOrCreateCart(tc, customerId, sessionId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
        unitPrice: product.price ?? product.sellingPrice,
        configurationId: dto.configurationId,
        configurationData: dto.configurationData as Prisma.InputJsonValue,
      },
    });
  }

  async updateItem(tc: ITenantContext, itemId: string, dto: UpdateCartItemDto, customerId?: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { customerId: customerId || undefined } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(tc: ITenantContext, itemId: string, customerId?: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { customerId: customerId || undefined } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(tc: ITenantContext, customerId?: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { customerId: customerId || undefined, status: 'ACTIVE' },
    });
    if (!cart) return;

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  private async getOrCreateCart(tc: ITenantContext, customerId?: string, sessionId?: string) {
    const existing = await this.prisma.cart.findFirst({
      where: {
        OR: [
          { customerId: customerId || undefined },
          { sessionId: sessionId || undefined },
        ],
        status: 'ACTIVE',
      },
    });

    if (existing) return existing;

    return this.prisma.cart.create({
      data: { customerId, sessionId, status: 'ACTIVE' },
    });
  }

  async getCartSummary(tc: ITenantContext, customerId?: string) {
    const cart = await this.getCart(tc, customerId);

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.unitPrice.toNumber() * item.quantity),
      0,
    );

    return {
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }
}
