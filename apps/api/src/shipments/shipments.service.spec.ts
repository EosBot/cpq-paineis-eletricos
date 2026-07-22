// @ts-nocheck
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ShipmentStatus } from '@prisma/client';
import { ShipmentsService } from './shipments.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock, PrismaMock } from '../testing/prisma.mock';
import { ITenantContext } from '../tenancy/tenant-context';

describe('ShipmentsService', () => {
  let service: ShipmentsService;
  let prisma: PrismaMock;

  const tenantContext: ITenantContext = {
    tenantId: 'tenant-uuid-123',
    userId: 'user-uuid-456',
  };

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module = await Test.createTestingModule({
      providers: [
        ShipmentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ShipmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShipment', () => {
    it('deve criar shipment com status PENDING', async () => {
      prisma.shipment.create.mockResolvedValue({
        id: 'ship-1',
        tenantId: tenantContext.tenantId,
        orderId: 'order-1',
        status: ShipmentStatus.PENDING,
      });

      const result = await service.createShipment(tenantContext, {
        orderId: 'order-1',
        recipientName: 'Test Customer',
      });

      expect(result.status).toBe(ShipmentStatus.PENDING);
      expect(prisma.shipment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: tenantContext.tenantId,
            orderId: 'order-1',
            status: ShipmentStatus.PENDING,
          }),
        }),
      );
    });
  });

  describe('advanceShipment', () => {
    it('deve avançar shipment em um passo (PENDING → LABEL_CREATED)', async () => {
      prisma.shipment.findFirstOrThrow.mockResolvedValue({
        id: 'ship-1',
        tenantId: tenantContext.tenantId,
        status: ShipmentStatus.PENDING,
      });
      prisma.shipment.update.mockResolvedValue({
        id: 'ship-1',
        status: ShipmentStatus.LABEL_CREATED,
      });

      const result = await service.advanceShipment(tenantContext, {
        shipmentId: 'ship-1',
        toStatus: ShipmentStatus.LABEL_CREATED,
      });

      expect(result.status).toBe(ShipmentStatus.LABEL_CREATED);
    });

    it('deve permitir EXCEPTION a partir de LABEL_CREATED', async () => {
      prisma.shipment.findFirstOrThrow.mockResolvedValue({
        id: 'ship-1',
        tenantId: tenantContext.tenantId,
        status: ShipmentStatus.LABEL_CREATED,
      });
      prisma.shipment.update.mockResolvedValue({
        id: 'ship-1',
        status: ShipmentStatus.EXCEPTION,
      });

      const result = await service.advanceShipment(tenantContext, {
        shipmentId: 'ship-1',
        toStatus: ShipmentStatus.EXCEPTION,
      });

      expect(result.status).toBe(ShipmentStatus.EXCEPTION);
    });

    it('deve rejeitar avanço de dois passos (PENDING → IN_TRANSIT)', async () => {
      prisma.shipment.findFirstOrThrow.mockResolvedValue({
        id: 'ship-1',
        tenantId: tenantContext.tenantId,
        status: ShipmentStatus.PENDING,
      });

      await expect(
        service.advanceShipment(tenantContext, {
          shipmentId: 'ship-1',
          toStatus: ShipmentStatus.IN_TRANSIT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar regresso (DELIVERED → IN_TRANSIT)', async () => {
      prisma.shipment.findFirstOrThrow.mockResolvedValue({
        id: 'ship-1',
        tenantId: tenantContext.tenantId,
        status: ShipmentStatus.DELIVERED,
      });

      await expect(
        service.advanceShipment(tenantContext, {
          shipmentId: 'ship-1',
          toStatus: ShipmentStatus.IN_TRANSIT,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
