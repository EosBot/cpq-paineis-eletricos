import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, QuoteStatus } from '@prisma/client';
import { BomService } from '../bom/bom.service';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { AdvanceOrderDto } from './dto/advance-order.dto';
import { ConvertQuoteToOrderDto } from './dto/convert-quote-to-order.dto';

const ORDER_FLOW = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'] as const;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bomService: BomService,
  ) {}

  async convertQuoteToOrder(tenantContext: ITenantContext, dto: ConvertQuoteToOrderDto) {
    const order = await this.prismaService.$transactionWithRLS(tenantContext.tenantId, async (transaction) => {
      const quote = await transaction.quote.findFirst({
        where: { id: dto.quoteId, tenantId: tenantContext.tenantId },
        include: {
          versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
        },
      });

      if (!quote) {
        throw new BadRequestException('Quote not found.');
      }

      if (quote.status !== QuoteStatus.CUSTOMER_APPROVED) {
        throw new BadRequestException(
          'Only customer-approved quotes can be converted to orders.',
        );
      }

      const quoteVersion = quote.versions[0];
      if (!quoteVersion) {
        throw new BadRequestException(
          'Approved quote must have at least one calculated version.',
        );
      }

      const existingOrder = await transaction.order.findFirst({
        where: { quoteId: quote.id, tenantId: tenantContext.tenantId },
      });
      if (existingOrder) {
        throw new BadRequestException('This quote has already been converted to an order.');
      }

      return transaction.order.create({
        data: {
          tenantId: tenantContext.tenantId,
          orderNumber: dto.orderNumber,
          quoteId: quote.id,
          quoteVersionId: quoteVersion.id,
          customerAccountId: quote.customerAccountId,
          status: OrderStatus.CONFIRMED,
          currencyCode: quote.currencyCode,
          confirmedAt: new Date(),
        },
      });
    });

    await this.prismaService.setTenantContext(tenantContext.tenantId);

    const quoteVersion = order.quoteVersionId
      ? await this.prismaService.quoteVersion.findFirst({
          where: { id: order.quoteVersionId, tenantId: tenantContext.tenantId },
        })
      : null;

    if (quoteVersion) {
      const existingBom = await this.prismaService.bOMVersion.findFirst({
        where: { quoteVersionId: quoteVersion.id, tenantId: tenantContext.tenantId },
      });

      if (!existingBom && order.quoteId) {
        await this.bomService.generateBomVersion(tenantContext, {
          quoteId: order.quoteId,
          quoteVersionId: quoteVersion.id,
          configurationSnapshotId: quoteVersion.configurationSnapshotId,
        });
      }
    }

    return this.prismaService.order.findUniqueOrThrow({
      where: { id: order.id },
      include: { bomVersion: true, shipments: true },
    });
  }

  async advanceOrder(tenantContext: ITenantContext, dto: AdvanceOrderDto) {
    return this.prismaService.$transactionWithRLS(tenantContext.tenantId, async (transaction) => {
      const order = await transaction.order.findFirstOrThrow({
        where: { id: dto.orderId, tenantId: tenantContext.tenantId },
      });

      const currentIndex = ORDER_FLOW.indexOf(order.status as any);
      const targetIndex = ORDER_FLOW.indexOf(dto.toStatus as any);

      if (targetIndex !== currentIndex + 1) {
        throw new BadRequestException(
          `Order cannot move from ${order.status} to ${dto.toStatus}.`,
        );
      }

      const now = new Date();
      const data: Prisma.OrderUpdateInput = { status: dto.toStatus as OrderStatus };
      switch (dto.toStatus) {
        case 'IN_PRODUCTION':
          data.producedAt = now;
          break;
        case 'READY_TO_SHIP':
          data.readyToShipAt = now;
          break;
        case OrderStatus.SHIPPED:
          data.shippedAt = now;
          break;
        case OrderStatus.DELIVERED:
          data.deliveredAt = now;
          break;
        default:
          break;
      }

      return transaction.order.update({
        where: { id: order.id },
        data,
        include: { bomVersion: true, shipments: true },
      });
    });
  }

  async listOrders(tenantContext: ITenantContext) {
    return this.prismaService.order.findMany({
      where: { tenantId: tenantContext.tenantId },
      include: { bomVersion: true, shipments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(tenantContext: ITenantContext, orderId: string) {
    return this.prismaService.order.findFirstOrThrow({
      where: { id: orderId, tenantId: tenantContext.tenantId },
      include: {
        bomVersion: true,
        shipments: { include: { shippingQuotes: true } },
      },
    });
  }
}
