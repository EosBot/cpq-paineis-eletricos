// @ts-nocheck
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { QuoteStatus, QuoteVersionTrigger } from '@prisma/client';
import { QuotesService } from './quotes.service';
import { BomService } from '../bom/bom.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock, PrismaMock } from '../testing/prisma.mock';
import { ITenantContext } from '../tenancy/tenant-context';

describe('QuotesService', () => {
  let service: QuotesService;
  let prisma: PrismaMock;
  let bomService: { generateBomVersion: jest.Mock };
  let pricingService: { resolvePricingContext: jest.Mock };

  const tenantContext: ITenantContext = {
    tenantId: 'tenant-uuid-123',
    userId: 'user-uuid-456',
  };

  beforeEach(async () => {
    prisma = createPrismaMock();
    bomService = { generateBomVersion: jest.fn() };
    pricingService = { resolvePricingContext: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        QuotesService,
        { provide: PrismaService, useValue: prisma },
        { provide: PricingService, useValue: pricingService },
        { provide: BomService, useValue: bomService },
      ],
    }).compile();

    service = module.get(QuotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createQuote', () => {
    it('deve criar quote com status DRAFT', async () => {
      prisma.quote.create.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        quoteNumber: 'Q-001',
        title: 'Test Quote',
        status: QuoteStatus.DRAFT,
        currencyCode: 'BRL',
      });

      const result = await service.createQuote(tenantContext, {
        customerAccountId: 'cust-1',
        quoteNumber: 'Q-001',
        title: 'Test Quote',
        currencyCode: 'BRL',
      });

      expect(result.status).toBe(QuoteStatus.DRAFT);
      expect(prisma.quote.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: tenantContext.tenantId,
            quoteNumber: 'Q-001',
            status: QuoteStatus.DRAFT,
          }),
        }),
      );
    });
  });

  describe('sendQuote', () => {
    it('deve enviar quote quando status é CALCULATED', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.CALCULATED,
      });
      prisma.quote.update.mockResolvedValue({
        id: 'quote-1',
        status: QuoteStatus.SENT,
        sentAt: new Date(),
      });

      const result = await service.sendQuote(tenantContext, { quoteId: 'quote-1' });

      expect(result.status).toBe(QuoteStatus.SENT);
    });

    it('deve rejeitar envio quando status não é CALCULATED', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.DRAFT,
      });

      await expect(
        service.sendQuote(tenantContext, { quoteId: 'quote-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar envio quando quote não existe', async () => {
      prisma.quote.findFirst.mockResolvedValue(null);

      await expect(
        service.sendQuote(tenantContext, { quoteId: 'quote-1' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('customerApproveQuote', () => {
    it('deve aprovar quote quando status é SENT', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.SENT,
      });
      prisma.quote.update.mockResolvedValue({
        id: 'quote-1',
        status: QuoteStatus.CUSTOMER_APPROVED,
        customerApprovedAt: new Date(),
      });

      const result = await service.customerApproveQuote(tenantContext, {
        quoteId: 'quote-1',
      });

      expect(result.status).toBe(QuoteStatus.CUSTOMER_APPROVED);
    });

    it('deve rejeitar aprovação quando status não é SENT', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.CALCULATED,
      });

      await expect(
        service.customerApproveQuote(tenantContext, { quoteId: 'quote-1' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('reopenQuote', () => {
    it('deve reabrir quote quando status é EXPIRED', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.EXPIRED,
        configuration: {
          snapshots: [{ id: 'snap-1', versionNumber: 1 }],
        },
        versions: [{ id: 'qv-1', versionNumber: 1 }],
      });
      prisma.quoteVersion.create.mockResolvedValue({
        id: 'qv-2',
        versionNumber: 2,
        trigger: QuoteVersionTrigger.REOPEN,
      });
      prisma.quote.update.mockResolvedValue({ id: 'quote-1', status: QuoteStatus.DRAFT });
      prisma.configuration.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.reopenQuote(tenantContext, {
        quoteId: 'quote-1',
        reason: 'Customer requested changes',
      });

      expect(result.versionNumber).toBe(2);
      expect(result.trigger).toBe(QuoteVersionTrigger.REOPEN);
    });

    it('deve rejeitar reabertura quando status não é EXPIRED', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.SENT,
        configuration: {
          snapshots: [{ id: 'snap-1', versionNumber: 1 }],
        },
        versions: [],
      });

      await expect(
        service.reopenQuote(tenantContext, { quoteId: 'quote-1', reason: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar reabertura quando quote não existe', async () => {
      prisma.quote.findFirst.mockResolvedValue(null);

      await expect(
        service.reopenQuote(tenantContext, { quoteId: 'quote-1', reason: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar reabertura quando não há snapshot', async () => {
      prisma.quote.findFirst.mockResolvedValue({
        id: 'quote-1',
        tenantId: tenantContext.tenantId,
        status: QuoteStatus.EXPIRED,
        configuration: { snapshots: [] },
        versions: [],
      });

      await expect(
        service.reopenQuote(tenantContext, { quoteId: 'quote-1', reason: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
