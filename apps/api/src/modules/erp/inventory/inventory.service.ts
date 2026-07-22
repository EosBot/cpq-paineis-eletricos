import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product, StockMovementType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(tenantId: string, dto: CreateProductDto): Promise<Product> {
    const existing = await this.prisma.product.findUnique({
      where: { tenantId_sku: { tenantId, sku: dto.sku } },
    });
    if (existing) {
      throw new BadRequestException('SKU already exists for this tenant.');
    }

    return this.prisma.product.create({
      data: {
        tenantId,
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        unitCost: new Prisma.Decimal(dto.unitCost),
        sellingPrice: new Prisma.Decimal(dto.sellingPrice),
        unit: dto.unit ?? 'UN',
        taxCode: dto.taxCode,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async listProducts(tenantId: string, includeInactive = false): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async getProduct(tenantId: string, productId: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  async createStockMovement(
    tenantId: string,
    dto: CreateStockMovementDto,
  ): Promise<void> {
    const product = await this.getProduct(tenantId, dto.productId);
    const location = await this.prisma.stockLocation.findFirst({
      where: { id: dto.locationId, tenantId },
    });
    if (!location) throw new NotFoundException('Stock location not found.');

    const quantity = new Prisma.Decimal(dto.quantity);
    if (quantity.lte(0)) {
      throw new BadRequestException('Quantity must be positive.');
    }

    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        tenantId_productId_locationId: {
          tenantId,
          productId: dto.productId,
          locationId: dto.locationId,
        },
      },
    });

    let newQuantity: Prisma.Decimal;
    let newAverageCost: Prisma.Decimal;

    if (dto.type === StockMovementType.ENTRADA) {
      const currentQty = inventoryItem?.quantity ?? new Prisma.Decimal(0);
      const currentCost = inventoryItem?.averageCost ?? new Prisma.Decimal(0);
      const entryCost = dto.unitCost
        ? new Prisma.Decimal(dto.unitCost)
        : product.unitCost;

      const totalValue = currentCost.mul(currentQty).add(entryCost.mul(quantity));
      const totalQuantity = currentQty.add(quantity);
      newAverageCost = totalQuantity.gt(0)
        ? totalValue.div(totalQuantity)
        : entryCost;
      newQuantity = totalQuantity;
    } else if (dto.type === StockMovementType.SAIDA) {
      const currentQty = inventoryItem?.quantity ?? new Prisma.Decimal(0);
      if (currentQty.lt(quantity)) {
        throw new BadRequestException('Insufficient stock.');
      }
      newQuantity = currentQty.sub(quantity);
      newAverageCost = inventoryItem?.averageCost ?? new Prisma.Decimal(0);
    } else {
      newQuantity = quantity;
      newAverageCost = inventoryItem?.averageCost ?? new Prisma.Decimal(0);
    }

    await this.prisma.$transaction(async (tx) => {
      if (inventoryItem) {
        await tx.inventoryItem.update({
          where: { id: inventoryItem.id },
          data: { quantity: newQuantity, averageCost: newAverageCost },
        });
      } else {
        await tx.inventoryItem.create({
          data: {
            tenantId,
            productId: dto.productId,
            locationId: dto.locationId,
            quantity: newQuantity,
            averageCost: newAverageCost,
          },
        });
      }

      await tx.stockMovement.create({
        data: {
          tenantId,
          productId: dto.productId,
          locationId: dto.locationId,
          type: dto.type,
          quantity,
          unitCost: dto.unitCost ? new Prisma.Decimal(dto.unitCost) : null,
          referenceType: dto.referenceType,
          referenceId: dto.referenceId,
          notes: dto.notes,
        },
      });
    });
  }

  async getStockLevels(
    tenantId: string,
    productId?: string,
  ): Promise<
    Array<{
      productId: string;
      productName: string;
      sku: string;
      locationId: string;
      locationName: string;
      quantity: Prisma.Decimal;
      reservedQuantity: Prisma.Decimal;
      availableQuantity: Prisma.Decimal;
      averageCost: Prisma.Decimal;
      minimumStock: Prisma.Decimal | null;
    }>
  > {
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        tenantId,
        ...(productId ? { productId } : {}),
      },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        location: { select: { id: true, name: true } },
      },
    });

    return items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      locationId: item.locationId,
      locationName: item.location.name,
      quantity: item.quantity,
      reservedQuantity: item.reservedQuantity,
      availableQuantity: item.quantity.sub(item.reservedQuantity),
      averageCost: item.averageCost,
      minimumStock: item.minimumStock,
    }));
  }
}
