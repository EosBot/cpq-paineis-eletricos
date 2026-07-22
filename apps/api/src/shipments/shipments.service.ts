import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, ShipmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { AddShippingQuoteDto } from './dto/add-shipping-quote.dto';
import { AdvanceShipmentDto } from './dto/advance-shipment.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { SelectShippingQuoteDto } from './dto/select-shipping-quote.dto';

const SHIPMENT_FLOW = ['PENDING', 'LABEL_CREATED', 'IN_TRANSIT', 'DELIVERED'] as const;

@Injectable()
export class ShipmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createShipment(tenantContext: ITenantContext, dto: CreateShipmentDto) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    return this.prismaService.shipment.create({
      data: {
        tenantId: tenantContext.tenantId,
        orderId: dto.orderId,
        recipientName: dto.recipientName ?? null,
        shippingAddress: (dto.shippingAddress ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        status: 'PENDING' as ShipmentStatus,
      },
      include: { shippingQuotes: true },
    });
  }

  async addShippingQuote(tenantContext: ITenantContext, dto: AddShippingQuoteDto) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    return this.prismaService.shippingQuote.create({
      data: {
        tenantId: tenantContext.tenantId,
        shipmentId: dto.shipmentId,
        provider: dto.provider,
        serviceName: dto.serviceName ?? null,
        amount: dto.amount,
        currencyCode: dto.currencyCode,
        estimatedDays: dto.estimatedDays ?? null,
        rawQuote: (dto.rawQuote ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
  }

  async selectShippingQuote(tenantContext: ITenantContext, dto: SelectShippingQuoteDto) {
    return this.prismaService.$transactionWithRLS(tenantContext.tenantId, async (transaction) => {
      const shippingQuote = await transaction.shippingQuote.findFirstOrThrow({
        where: { id: dto.shippingQuoteId, tenantId: tenantContext.tenantId },
        include: { shipment: true },
      });

      await transaction.shippingQuote.updateMany({
        where: {
          shipmentId: shippingQuote.shipmentId,
          tenantId: tenantContext.tenantId,
          id: { not: dto.shippingQuoteId },
        },
        data: { selectedAt: null },
      });

      const updated = await transaction.shippingQuote.update({
        where: { id: dto.shippingQuoteId },
        data: { selectedAt: new Date() },
      });

      await transaction.shipment.update({
        where: { id: shippingQuote.shipmentId },
        data: { carrier: updated.provider },
      });

      return transaction.shipment.findUniqueOrThrow({
        where: { id: shippingQuote.shipmentId },
        include: { shippingQuotes: true },
      });
    });
  }

  async advanceShipment(tenantContext: ITenantContext, dto: AdvanceShipmentDto) {
    return this.prismaService.$transactionWithRLS(tenantContext.tenantId, async (transaction) => {
      const shipment = await transaction.shipment.findFirstOrThrow({
        where: { id: dto.shipmentId, tenantId: tenantContext.tenantId },
      });

      const allowed = this.nextShipmentStatuses(shipment.status);
      if (!allowed.includes(dto.toStatus as ShipmentStatus)) {
        throw new BadRequestException(
          `Shipment cannot move from ${shipment.status} to ${dto.toStatus}.`,
        );
      }

      const now = new Date();
      const data: Prisma.ShipmentUpdateInput = { status: dto.toStatus as ShipmentStatus };
      if (dto.toStatus === 'IN_TRANSIT') {
        data.shippedAt = now;
      }
      if (dto.toStatus === 'DELIVERED') {
        data.deliveredAt = now;
      }

      return transaction.shipment.update({
        where: { id: shipment.id },
        data,
        include: { shippingQuotes: true },
      });
    });
  }

  async listShipments(tenantContext: ITenantContext) {
    return this.prismaService.shipment.findMany({
      where: { tenantId: tenantContext.tenantId },
      include: { shippingQuotes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShipment(tenantContext: ITenantContext, shipmentId: string) {
    return this.prismaService.shipment.findFirstOrThrow({
      where: { id: shipmentId, tenantId: tenantContext.tenantId },
      include: { shippingQuotes: true },
    });
  }

  private nextShipmentStatuses(current: ShipmentStatus): ShipmentStatus[] {
    const index = SHIPMENT_FLOW.indexOf(current as typeof SHIPMENT_FLOW[number]);
    const next: ShipmentStatus[] = [];
    if (index >= 0 && index < SHIPMENT_FLOW.length - 1) {
      next.push(SHIPMENT_FLOW[index + 1] as ShipmentStatus);
    }
    if (current === 'LABEL_CREATED' || current === 'IN_TRANSIT') {
      next.push('EXCEPTION' as ShipmentStatus);
    }
    return next;
  }
}
