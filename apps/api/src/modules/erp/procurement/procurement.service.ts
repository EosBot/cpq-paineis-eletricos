import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PurchaseOrderStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  async createSupplier(tenantId: string, dto: CreateSupplierDto) {
    if (dto.taxId) {
      const existing = await this.prisma.supplier.findUnique({
        where: { tenantId_taxId: { tenantId, taxId: dto.taxId } },
      });
      if (existing) {
        throw new BadRequestException('Supplier with this tax ID already exists.');
      }
    }

    return this.prisma.supplier.create({
      data: {
        tenantId,
        name: dto.name,
        legalName: dto.legalName,
        taxId: dto.taxId,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async listSuppliers(tenantId: string) {
    return this.prisma.supplier.findMany({
      where: { tenantId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createPurchaseOrder(tenantId: string, dto: CreatePurchaseOrderDto) {
    const existing = await this.prisma.purchaseOrder.findUnique({
      where: { tenantId_orderNumber: { tenantId, orderNumber: dto.orderNumber } },
    });
    if (existing) {
      throw new BadRequestException('Order number already exists.');
    }

    const supplier = await this.prisma.supplier.findFirst({
      where: { id: dto.supplierId, tenantId },
    });
    if (!supplier) throw new NotFoundException('Supplier not found.');

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
        const unitCost = new Prisma.Decimal(item.unitCost);
        const total = quantity.mul(unitCost);
        totalAmount = totalAmount.add(total);

        return {
          tenantId,
          productId: item.productId,
          quantity,
          quantityReceived: new Prisma.Decimal(0),
          unitCost,
          total,
        };
      }),
    );

    return this.prisma.purchaseOrder.create({
      data: {
        tenantId,
        orderNumber: dto.orderNumber,
        supplierId: dto.supplierId,
        status: PurchaseOrderStatus.RASCUNHO,
        totalAmount,
        expectedDelivery: dto.expectedDelivery ? new Date(dto.expectedDelivery) : null,
        notes: dto.notes,
        items: { create: itemsData },
      },
      include: { items: true },
    });
  }

  async listPurchaseOrders(tenantId: string, status?: PurchaseOrderStatus) {
    return this.prisma.purchaseOrder.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
      },
      include: {
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async receiveOrder(tenantId: string, orderId: string, locationId: string) {
    const order = await this.getOrder(tenantId, orderId);
    if (order.status !== PurchaseOrderStatus.ENVIADO) {
      throw new BadRequestException('Only sent orders can be received.');
    }

    const updated = await this.prisma.purchaseOrder.update({
      where: { id: orderId },
      data: {
        status: PurchaseOrderStatus.RECEBIDO,
        receivedAt: new Date(),
      },
      include: { items: true },
    });

    for (const item of updated.items) {
      if (item.quantity.gt(0)) {
        await this.inventoryService.createStockMovement(tenantId, {
          productId: item.productId,
          locationId,
          type: 'ENTRADA',
          quantity: item.quantity.toString(),
          unitCost: item.unitCost.toString(),
          referenceType: 'PURCHASE_ORDER',
          referenceId: orderId,
        });
      }
    }

    return updated;
  }

  private async getOrder(tenantId: string, orderId: string) {
    const order = await this.prisma.purchaseOrder.findFirst({
      where: { id: orderId, tenantId },
    });
    if (!order) throw new NotFoundException('Purchase order not found.');
    return order;
  }
}
