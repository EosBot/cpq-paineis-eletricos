// @ts-nocheck
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createPrismaMock, PrismaMock } from '../../testing/prisma.mock';
import { ITenantContext } from '../../tenancy/tenant-context';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaMock;

  const tenantContext: ITenantContext = {
    tenantId: 'tenant-uuid-123',
    userId: 'user-uuid-456',
  };

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('deve criar carrinho vazio quando não existe', async () => {
      prisma.cart.findFirst.mockResolvedValue(null);
      prisma.cart.create.mockResolvedValue({
        id: 'cart-1',
        customerId: 'cust-1',
        status: 'ACTIVE',
        items: [],
      });

      const result = await service.getCart(tenantContext, 'cust-1');

      expect(prisma.cart.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerId: 'cust-1',
            status: 'ACTIVE',
          }),
        }),
      );
      expect(result.items).toEqual([]);
    });

    it('deve retornar carrinho existente', async () => {
      const existingCart = {
        id: 'cart-1',
        customerId: 'cust-1',
        status: 'ACTIVE',
        items: [{ id: 'item-1', productId: 'prod-1', quantity: 2 }],
      };
      prisma.cart.findFirst.mockResolvedValue(existingCart);

      const result = await service.getCart(tenantContext, 'cust-1');

      expect(result.id).toBe('cart-1');
      expect(prisma.cart.create).not.toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('deve adicionar item ao carrinho', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        tenantId: tenantContext.tenantId,
        isActive: true,
        price: 100,
        sellingPrice: 90,
      });
      prisma.cart.findFirst.mockResolvedValue(null);
      prisma.cart.create.mockResolvedValue({ id: 'cart-1' });
      prisma.cartItem.findFirst.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 1,
      });

      const result = await service.addItem(
        tenantContext,
        { productId: 'prod-1', quantity: 1 },
        'cust-1',
      );

      expect(prisma.cartItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            productId: 'prod-1',
            quantity: 1,
          }),
        }),
      );
    });

    it('deve incrementar quantidade se item já existe', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        tenantId: tenantContext.tenantId,
        isActive: true,
        price: 100,
        sellingPrice: 90,
      });
      prisma.cart.findFirst.mockResolvedValue({ id: 'cart-1' });
      prisma.cartItem.findFirst.mockResolvedValue({
        id: 'item-1',
        quantity: 2,
      });
      prisma.cartItem.update.mockResolvedValue({
        id: 'item-1',
        quantity: 3,
      });

      const result = await service.addItem(
        tenantContext,
        { productId: 'prod-1', quantity: 1 },
        'cust-1',
      );

      expect(prisma.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { quantity: 3 },
        }),
      );
    });

    it('deve lançar NotFoundException se produto não existe', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(
        service.addItem(tenantContext, { productId: 'invalid', quantity: 1 }, 'cust-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve adicionar item com configurationData', async () => {
      prisma.product.findFirst.mockResolvedValue({
        id: 'prod-1',
        tenantId: tenantContext.tenantId,
        isActive: true,
        price: null,
        sellingPrice: 500,
      });
      prisma.cart.findFirst.mockResolvedValue({ id: 'cart-1' });
      prisma.cartItem.findFirst.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 1,
      });

      const configData = { project: { name: 'Test' }, placements: [] };
      await service.addItem(
        tenantContext,
        { productId: 'prod-1', quantity: 1, configurationData: configData },
        'cust-1',
      );

      expect(prisma.cartItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            configurationData: configData,
          }),
        }),
      );
    });
  });

  describe('updateItem', () => {
    it('deve atualizar quantidade do item', async () => {
      prisma.cartItem.findFirst.mockResolvedValue({ id: 'item-1' });
      prisma.cartItem.update.mockResolvedValue({
        id: 'item-1',
        quantity: 5,
      });

      const result = await service.updateItem(
        tenantContext,
        'item-1',
        { quantity: 5 },
        'cust-1',
      );

      expect(result.quantity).toBe(5);
    });

    it('deve lançar NotFoundException se item não existe', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.updateItem(tenantContext, 'invalid', { quantity: 1 }, 'cust-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('deve remover item do carrinho', async () => {
      prisma.cartItem.findFirst.mockResolvedValue({ id: 'item-1' });
      prisma.cartItem.delete.mockResolvedValue({ id: 'item-1' });

      await service.removeItem(tenantContext, 'item-1', 'cust-1');

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });

    it('deve lançar NotFoundException se item não existe', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.removeItem(tenantContext, 'invalid', 'cust-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearCart', () => {
    it('deve remover todos os itens do carrinho', async () => {
      prisma.cart.findFirst.mockResolvedValue({ id: 'cart-1' });
      prisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      await service.clearCart(tenantContext, 'cust-1');

      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
    });

    it('deve ser seguro quando carrinho não existe', async () => {
      prisma.cart.findFirst.mockResolvedValue(null);

      await service.clearCart(tenantContext, 'cust-1');

      expect(prisma.cartItem.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('getCartSummary', () => {
    it('deve calcular subtotal e itemCount', async () => {
      prisma.cart.findFirst.mockResolvedValue({
        id: 'cart-1',
        items: [
          { unitPrice: { toNumber: () => 100 }, quantity: 2 },
          { unitPrice: { toNumber: () => 50 }, quantity: 1 },
        ],
      });

      const result = await service.getCartSummary(tenantContext, 'cust-1');

      expect(result.itemCount).toBe(3);
      expect(result.subtotal).toBe(250);
    });
  });
});
