import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FiscalDocumentStatus, FiscalDocumentType } from '@prisma/client';
import { FiscalService } from './fiscal.service';

class CreateSeriesDto {
  code!: string;
  documentType!: FiscalDocumentType;
  nextNumber?: number;
  environment?: string;
}

class CreateFiscalDocumentDto {
  documentType!: FiscalDocumentType;
  seriesId?: string;
  customerId?: string;
  customerName?: string;
  customerTaxId?: string;
  customerEmail?: string;
  customerAddress?: Record<string, string>;
  items!: Array<{
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
}

@Controller('erp/fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Post('series')
  createSeries(@Body() dto: CreateSeriesDto, @Query('tenantId') tenantId: string) {
    return this.fiscalService.createSeries(tenantId, dto);
  }

  @Get('series')
  listSeries(
    @Query('tenantId') tenantId: string,
    @Query('documentType') documentType?: FiscalDocumentType,
  ) {
    return this.fiscalService.listSeries(tenantId, documentType);
  }

  @Post('documents')
  createDocument(
    @Body() dto: CreateFiscalDocumentDto,
    @Query('tenantId') tenantId: string,
  ) {
    return this.fiscalService.createDocument(tenantId, dto);
  }

  @Get('documents')
  listDocuments(
    @Query('tenantId') tenantId: string,
    @Query('status') status?: FiscalDocumentStatus,
    @Query('documentType') documentType?: FiscalDocumentType,
  ) {
    return this.fiscalService.listDocuments(tenantId, status, documentType);
  }

  @Get('documents/:id')
  getDocument(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.fiscalService.getDocument(tenantId, id);
  }

  @Patch('documents/:id/cancel')
  cancelDocument(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.fiscalService.cancelDocument(tenantId, id);
  }
}
