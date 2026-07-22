// @ts-nocheck
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OrderStatus, QuoteStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { BomService } from '../bom/bom.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock, PrismaMock } from '../testing/prisma.mock';
import { ITenantContext } from '../tenancy/tenant-context';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaMock;
  let bomService: { generateBomVersion: jest.Mock };

  const tenantContext: ITenantContext = {
    tenantId: 'tenant-uuid-123',
    userId: 'user-uuid-456',
  };

  beforeEach(async () => {
    prisma = createPrismaMock();
    bomService = { generateBomVersion: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
        { provide: BomService, useValue: bomService },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('convertQuoteToOrder', () => {
    it('deve converter quote CUSTOMER_APPROVED para order', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.CUSTOMER_APPROVED,
        customerAccountId: 'cust-1',
        currencyCode: 'BRL',
        versions: [{ id: 'qv-1', versionNumber: 1, configurationSnapshotId: 'snap-1' }],
      });
      prisma.order.findFirst.mockResolvedValue(null);
      prisma.order.create.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'ORD-001',
        status: OrderStatus.CONFIRMED,
      });
      prisma.quoteVersion.findFirstOrThrow.mockResolvedValue({
        id: 'qv-1',
        configurationSnapshotId: 'snap-1',
      });
      prisma.bOMVersion.findFirst.mockResolvedValue(null);
      prisma.order.findUniqueOrThrow.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CONFIRMED,
      });

      const result = await service.convertQuoteToOrder(tenantContext, {
        quoteId: 'quote-1',
        orderNumber: 'ORD-001',
      });

      expect(result.status).toBe(OrderStatus.CONFIRMED);
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: tenantContext.tenantId,
            orderNumber: 'ORD-001',
            status: OrderStatus.CONFIRMED,
          }),
        }),
      );
    });

    it('deve rejeitar conversão quando quote não está CUSTOMER_APPROVED', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.SENT,
        versions: [],
      });

      await expect(
        service.convertQuoteToOrder(tenantContext, { quoteId: 'quote-1', orderNumber: 'ORD-001' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar conversão quando quote não existe', async () => {
      prisma.quote.findFirst.mockResolvedValue(null);

      await expect(
        service.convertQuoteToOrder(tenantContext, { quoteId: 'quote-1', orderNumber: 'ORD-001' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar conversão duplicada', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.CUSTOMER_APPROVED,
        customerAccountId: 'cust-1',
        currencyCode: 'BRL',
        versions: [{ id: 'qv-1', versionNumber: 1 }],
      });
      prisma.order.findFirst.mockResolvedValue({ id: 'order-existing' });

      await expect(
        service.convertQuoteToOrder(tenantContext, { quoteId: 'quote-1', orderNumber: 'ORD-001' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('advanceOrder', () => {
    it('deve avançar order em um passo (CONFIRMED → IN_PRODUCTION)', async () => {
      prisma.order.findFirstOrThrow.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.CONFIRMED,
      });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.IN_PRODUCTION,
      });

      const result = await service.advanceOrder(tenantContext, {
        orderId: 'order-1',
        toStatus: OrderStatus.IN_PRODUCTION,
      });

      expect(result.status).toBe(OrderStatus.IN_PRODUCTION);
    });

    it('deve rejeitar avanço de dois passos (CONFIRMED → SHIPPED)', async () => {
      prisma.order.findFirstOrThrow.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.CONFIRMED,
      });

      await expect(
        service.advanceOrder(tenantContext, { orderId: 'order-1', toStatus: OrderStatus.SHIPPED }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar regresso (IN_PRODUCTION → CONFIRMED)', async () => {
      prisma.order.findFirstOrThrow.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.IN_PRODUCTION,
      });

      await expect(
        service.advanceOrder(tenantContext, { orderId: 'order-1', toStatus: OrderStatus.CONFIRMED }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
