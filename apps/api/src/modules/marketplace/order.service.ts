import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { CreateOrderDto } from './dto/marketplace.dto';

@Injectable()
export class MarketplaceOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(tc: ITenantContext, filters?: { status?: string; customerId?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId: tc.tenantId };
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getById(tc: ITenantContext, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId: tc.tenantId },
      include: {
        customer: true,
        items: { include: { product: true } },
        shipments: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async createFromCart(tc: ITenantContext, customerId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findFirst({
      where: { customerId, status: 'ACTIVE' },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.unitPrice.toNumber() * item.quantity),
      0,
    );

    const taxAmount = 0;
    const discountAmount = 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const orderNumber = `ORD-${Date.now()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          tenantId: tc.tenantId,
          orderNumber,
          customerId,
          status: 'PENDING',
          currencyCode: 'BRL',
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          shippingAddress: dto.shippingAddress || undefined,
          shippingMethod: dto.shippingMethod || undefined,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice.toNumber() * item.quantity,
              configurationId: item.configurationId,
              configurationData: item.configurationData as Prisma.InputJsonValue,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'COMPLETED' },
      });

      return newOrder;
    });

    return order;
  }

  async advanceStatus(tc: ITenantContext, id: string) {
    const order = await this.getById(tc, id);
    const transitions: Record<string, string> = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'IN_PRODUCTION',
      IN_PRODUCTION: 'READY_TO_SHIP',
      READY_TO_SHIP: 'SHIPPED',
      SHIPPED: 'DELIVERED',
    };

    const nextStatus = transitions[order.status];
    if (!nextStatus) throw new BadRequestException(`Cannot advance from status ${order.status}`);

    const data: any = { status: nextStatus };
    if (nextStatus === 'CONFIRMED') data.confirmedAt = new Date();
    if (nextStatus === 'IN_PRODUCTION') data.producedAt = new Date();
    if (nextStatus === 'READY_TO_SHIP') data.readyToShipAt = new Date();
    if (nextStatus === 'SHIPPED') data.shippedAt = new Date();
    if (nextStatus === 'DELIVERED') data.deliveredAt = new Date();

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async cancel(tc: ITenantContext, id: string) {
    const order = await this.getById(tc, id);
    if (['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status)) {
      throw new BadRequestException(`Cannot cancel order in status ${order.status}`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
