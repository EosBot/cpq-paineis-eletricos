import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FiscalDocumentStatus, FiscalDocumentType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class FiscalService {
  constructor(private readonly prisma: PrismaService) {}

  async createSeries(tenantId: string, data: {
    code: string;
    documentType: string;
    nextNumber?: number;
    environment?: string;
  }) {
    const existing = await this.prisma.fiscalSeries.findUnique({
      where: { tenantId_code: { tenantId, code: data.code } },
    });
    if (existing) {
      throw new BadRequestException('Series code already exists.');
    }

    return this.prisma.fiscalSeries.create({
      data: {
        tenantId,
        code: data.code,
        documentType: data.documentType as FiscalDocumentType,
        nextNumber: data.nextNumber ?? 1,
        environment: data.environment ?? '2',
      },
    });
  }

  async listSeries(tenantId: string, documentType?: FiscalDocumentType) {
    return this.prisma.fiscalSeries.findMany({
      where: {
        tenantId,
        ...(documentType ? { documentType } : {}),
      },
      orderBy: { code: 'asc' },
    });
  }

  async createDocument(tenantId: string, data: {
    documentType: string;
    seriesId?: string;
    customerId?: string;
    customerName?: string;
    customerTaxId?: string;
    customerEmail?: string;
    customerAddress?: Record<string, string>;
    items: Array<{
      productId?: string;
      description: string;
      ncmCode?: string;
      cfopCode: string;
      unit?: string;
      quantity: string;
      unitPrice: string;
      discount?: string;
      icmsCst?: string;
      icmsRate?: string;
      ipiRate?: string;
      pisCst?: string;
      pisRate?: string;
      cofinsCst?: string;
      cofinsRate?: string;
      issRate?: string;
    }>;
    notes?: string;
  }) {
    const series = data.seriesId
      ? await this.prisma.fiscalSeries.findFirst({
          where: { id: data.seriesId, tenantId },
        })
      : await this.prisma.fiscalSeries.findFirst({
          where: { tenantId, documentType: data.documentType as FiscalDocumentType },
          orderBy: { createdAt: 'asc' },
        });

    if (!series) {
      throw new BadRequestException('No fiscal series found for this document type.');
    }

    const documentNumber = series.nextNumber;
    const chaveAcesso = this.generateChaveAcesso(tenantId, data.documentType as FiscalDocumentType, documentNumber);

    let totalAmount = new Prisma.Decimal(0);
    let taxAmount = new Prisma.Decimal(0);
    let discountAmount = new Prisma.Decimal(0);

    const itemsData = data.items.map((item, index) => {
      const quantity = new Prisma.Decimal(item.quantity);
      const unitPrice = new Prisma.Decimal(item.unitPrice);
      const discount = new Prisma.Decimal(item.discount ?? 0);
      const totalPrice = quantity.mul(unitPrice).sub(discount);

      const icmsRate = item.icmsRate ? new Prisma.Decimal(item.icmsRate) : null;
      const ipiRate = item.ipiRate ? new Prisma.Decimal(item.ipiRate) : null;
      const pisRate = item.pisRate ? new Prisma.Decimal(item.pisRate) : null;
      const cofinsRate = item.cofinsRate ? new Prisma.Decimal(item.cofinsRate) : null;
      const issRate = item.issRate ? new Prisma.Decimal(item.issRate) : null;

      const icmsValue = icmsRate ? totalPrice.mul(icmsRate).div(100) : null;
      const ipiValue = ipiRate ? totalPrice.mul(ipiRate).div(100) : null;
      const pisValue = pisRate ? totalPrice.mul(pisRate).div(100) : null;
      const cofinsValue = cofinsRate ? totalPrice.mul(cofinsRate).div(100) : null;
      const issValue = issRate ? totalPrice.mul(issRate).div(100) : null;

      const itemTax = (icmsValue ?? new Prisma.Decimal(0))
        .add(ipiValue ?? new Prisma.Decimal(0))
        .add(pisValue ?? new Prisma.Decimal(0))
        .add(cofinsValue ?? new Prisma.Decimal(0))
        .add(issValue ?? new Prisma.Decimal(0));

      totalAmount = totalAmount.add(totalPrice);
      taxAmount = taxAmount.add(itemTax);
      discountAmount = discountAmount.add(discount);

      return {
        tenantId,
        itemNumber: index + 1,
        productId: item.productId,
        description: item.description,
        ncmCode: item.ncmCode,
        cfopCode: item.cfopCode,
        unit: item.unit ?? 'UN',
        quantity,
        unitPrice,
        totalPrice,
        discount,
        icmsCst: item.icmsCst,
        icmsRate,
        icmsValue,
        ipiRate,
        ipiValue,
        pisCst: item.pisCst,
        pisRate,
        pisValue,
        cofinsCst: item.cofinsCst,
        cofinsRate,
        cofinsValue,
        issRate,
        issValue,
      };
    });

    return this.prisma.$transaction(async (tx) => {
      await tx.fiscalSeries.update({
        where: { id: series.id },
        data: { nextNumber: { increment: 1 } },
      });

      return tx.fiscalDocument.create({
        data: {
          tenantId,
          seriesId: series.id,
          documentType: data.documentType as FiscalDocumentType,
          status: FiscalDocumentStatus.RASCUNHO,
          seriesCode: series.code,
          documentNumber,
          chaveAcesso,
          customerId: data.customerId,
          customerName: data.customerName,
          customerTaxId: data.customerTaxId,
          customerEmail: data.customerEmail,
          customerAddress: data.customerAddress as Prisma.InputJsonValue,
          totalAmount,
          discountAmount,
          taxAmount,
          netAmount: totalAmount.add(taxAmount),
          notes: data.notes,
          items: { create: itemsData },
        },
        include: { items: true },
      });
    });
  }

  async listDocuments(
    tenantId: string,
    status?: FiscalDocumentStatus,
    documentType?: FiscalDocumentType,
  ) {
    return this.prisma.fiscalDocument.findMany({
      where: {
        tenantId,
        ...(status ? { status } : {}),
        ...(documentType ? { documentType } : {}),
      },
      include: {
        series: { select: { id: true, code: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocument(tenantId: string, documentId: string) {
    const doc = await this.prisma.fiscalDocument.findFirst({
      where: { id: documentId, tenantId },
      include: {
        series: true,
        items: { orderBy: { itemNumber: 'asc' } },
      },
    });
    if (!doc) throw new NotFoundException('Fiscal document not found.');
    return doc;
  }

  async cancelDocument(tenantId: string, documentId: string) {
    const doc = await this.getDocument(tenantId, documentId);
    if (doc.status === FiscalDocumentStatus.CANCELADO) {
      throw new BadRequestException('Document already canceled.');
    }
    if (doc.status === FiscalDocumentStatus.AUTORIZADO) {
      throw new BadRequestException('Authorized documents require formal cancellation via SEFAZ.');
    }

    return this.prisma.fiscalDocument.update({
      where: { id: documentId },
      data: {
        status: FiscalDocumentStatus.CANCELADO,
        cancellationDate: new Date(),
      },
    });
  }

  private generateChaveAcesso(
    tenantId: string,
    type: FiscalDocumentType,
    number: number,
  ): string {
    const cUF = '35';
    const aamm = new Date().toISOString().slice(2, 7).replace('-', '');
    const cnpj = tenantId.slice(0, 14).padEnd(14, '0');
    const mod = type === FiscalDocumentType.NFE ? '55' : '65';
    const serie = '001';
    const nNF = String(number).padStart(9, '0');
    const cNF = randomUUID().replace(/\D/g, '').slice(0, 8);
    return `${cUF}${aamm}${cnpj}${mod}${serie}${nNF}${cNF}`;
  }
}
