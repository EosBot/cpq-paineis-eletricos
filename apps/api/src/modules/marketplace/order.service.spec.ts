// @ts-nocheck
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OrderStatus } from '@prisma/client';
import { MarketplaceOrderService } from './order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock, PrismaMock } from '../../testing/prisma.mock';
import { ITenantContext } from '../../tenancy/tenant-context';

describe('MarketplaceOrderService', () => {
  let service: MarketplaceOrderService;
  let prisma: PrismaMock;

  const tenantContext: ITenantContext = {
    tenantId: 'tenant-uuid-123',
    userId: 'user-uuid-456',
  };

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        MarketplaceOrderService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(MarketplaceOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFromCart', () => {
    it('deve criar pedido a partir do carrinho', async () => {
      prisma.cart.findFirst.mockResolvedValue({
        id: 'cart-1',
        items: [
          {
            productId: 'prod-1',
            product: { name: 'Product A' },
            quantity: 2,
            unitPrice: { toNumber: () => 100 },
            configurationId: null,
            configurationData: null,
          },
        ],
      });
      prisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          order: {
            create: jest.fn().mockResolvedValue({
              id: 'order-1',
              orderNumber: 'ORD-123',
              status: OrderStatus.PENDING,
            }),
          },
          cart: {
            update: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      const result = await service.createFromCart(tenantContext, 'cust-1', {});

      expect(result.status).toBe(OrderStatus.PENDING);
    });

    it('deve lançar BadRequestException se carrinho está vazio', async () => {
      prisma.cart.findFirst.mockResolvedValue({
        id: 'cart-1',
        items: [],
      });

      await expect(
        service.createFromCart(tenantContext, 'cust-1', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se carrinho não existe', async () => {
      prisma.cart.findFirst.mockResolvedValue(null);

      await expect(
        service.createFromCart(tenantContext, 'cust-1', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve copiar configurationId e configurationData para order items', async () => {
      prisma.cart.findFirst.mockResolvedValue({
        id: 'cart-1',
        items: [
          {
            productId: 'prod-1',
            product: { name: 'Configurable Panel' },
            quantity: 1,
            unitPrice: { toNumber: () => 500 },
            configurationId: 'config-1',
            configurationData: { project: { name: 'Test' } },
          },
        ],
      });

      let createdOrderData: any;
      prisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          order: {
            create: jest.fn().mockImplementation((data) => {
              createdOrderData = data;
              return Promise.resolve({ id: 'order-1' });
            }),
          },
          cart: {
            update: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      await service.createFromCart(tenantContext, 'cust-1', {});

      expect(createdOrderData.data.items.create[0].configurationId).toBe('config-1');
      expect(createdOrderData.data.items.create[0].configurationData).toEqual({
        project: { name: 'Test' },
      });
    });
  });

  describe('getOrders', () => {
    it('deve listar pedidos com paginação', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: 'order-1', orderNumber: 'ORD-001' },
      ]);
      prisma.order.count.mockResolvedValue(1);

      const result = await service.getOrders(tenantContext, {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('deve filtrar por status', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);

      await service.getOrders(tenantContext, { status: 'CONFIRMED' });

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'CONFIRMED',
          }),
        }),
      );
    });
  });

  describe('getById', () => {
    it('deve retornar pedido pelo ID', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'ORD-001',
      });

      const result = await service.getById(tenantContext, 'order-1');

      expect(result.id).toBe('order-1');
    });

    it('deve lançar NotFoundException se pedido não existe', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(
        service.getById(tenantContext, 'invalid'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('advanceStatus', () => {
    it('deve avançar de PENDING para CONFIRMED', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.PENDING,
      });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CONFIRMED,
      });

      const result = await service.advanceStatus(tenantContext, 'order-1');

      expect(result.status).toBe(OrderStatus.CONFIRMED);
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: OrderStatus.CONFIRMED,
            confirmedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('deve lançar BadRequestException se não pode avançar', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.DELIVERED,
      });

      await expect(
        service.advanceStatus(tenantContext, 'order-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel', () => {
    it('deve cancelar pedido', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.PENDING,
      });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.CANCELLED,
      });

      const result = await service.cancel(tenantContext, 'order-1');

      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

    it('deve lançar BadRequestException se pedido já foi entregue', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.DELIVERED,
      });

      await expect(
        service.cancel(tenantContext, 'order-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se pedido já está cancelado', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'order-1',
        tenantId: tenantContext.tenantId,
        status: OrderStatus.CANCELLED,
      });

      await expect(
        service.cancel(tenantContext, 'order-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
