import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SalesOrderStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    tenantId: string,
    dto: CreateSalesOrderDto,
  ) {
    const existing = await this.prisma.salesOrder.findUnique({
      where: { tenantId_orderNumber: { tenantId, orderNumber: dto.orderNumber } },
    });
    if (existing) {
      throw new BadRequestException('Order number already exists.');
    }

    const customer = await this.prisma.customerAccount.findFirst({
      where: { id: dto.customerId, tenantId },
    });
    if (!customer) throw new NotFoundException('Customer not found.');

    let totalAmount = new Prisma.Decimal(0);

    const itemsData = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.prisma.product.findFirst({
          where: { id: item.productId, tenantId },
        });
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found.`);
        }

        const quantity = new Prisma.Decimal(item.quantity);
        const unitPrice = new Prisma.Decimal(item.unitPrice ?? product.sellingPrice);
        const discount = new Prisma.Decimal(item.discount ?? 0);
        const total = quantity.mul(unitPrice).sub(discount);
        totalAmount = totalAmount.add(total);

        return {
          tenantId,
          productId: item.productId,
          quantity,
          unitPrice,
          discount,
          taxAmount: new Prisma.Decimal(0),
          total,
        };
      }),
    );

    return this.prisma.salesOrder.create({
      data: {
        tenantId,
        orderNumber: dto.orderNumber,
        customerId: dto.customerId,
        status: SalesOrderStatus.RASCUNHO,
        totalAmount,
        discountAmount: new Prisma.Decimal(0),
        taxAmount: new Prisma.Decimal(0),
        notes: dto.notes,
        items: { create: itemsData },
      },
      include: { items: true },
    });
  }

  async listOrders(
    tenantId: string,
    status?: SalesOrderStatus,
  ) {
    return this.prisma.salesOrder.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
      },
      include: {
        customer: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirmOrder(tenantId: string, orderId: string) {
    const order = await this.getOrder(tenantId, orderId);
    if (order.status !== SalesOrderStatus.RASCUNHO) {
      throw new BadRequestException('Only draft orders can be confirmed.');
    }

    return this.prisma.salesOrder.update({
      where: { id: orderId },
      data: { status: SalesOrderStatus.CONFIRMADO },
    });
  }

  async cancelOrder(tenantId: string, orderId: string) {
    const order = await this.getOrder(tenantId, orderId);
    if (order.status === SalesOrderStatus.ENTREGUE) {
      throw new BadRequestException('Delivered orders cannot be canceled.');
    }

    return this.prisma.salesOrder.update({
      where: { id: orderId },
      data: { status: SalesOrderStatus.CANCELADO },
    });
  }

  private async getOrder(tenantId: string, orderId: string) {
    const order = await this.prisma.salesOrder.findFirst({
      where: { id: orderId, tenantId },
    });
    if (!order) throw new NotFoundException('Sales order not found.');
    return order;
  }
}
