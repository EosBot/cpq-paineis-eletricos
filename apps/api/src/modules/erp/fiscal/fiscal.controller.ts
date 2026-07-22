import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FiscalDocumentStatus, FiscalDocumentType } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { FiscalService } from './fiscal.service';

class CreateSeriesDto {
  @IsString()
  @MaxLength(20)
  code!: string;

  @IsEnum(FiscalDocumentType)
  documentType!: FiscalDocumentType;

  @IsOptional()
  @IsInt()
  nextNumber?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1)
  environment?: string;
}

class FiscalDocumentItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsString()
  @MaxLength(500)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ncmCode?: string;

  @IsString()
  @MaxLength(4)
  cfopCode!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  unit?: string;

  @IsString()
  quantity!: string;

  @IsString()
  unitPrice!: string;

  @IsOptional()
  @IsString()
  discount?: string;

  @IsOptional()
  @IsString()
  icmsCst?: string;

  @IsOptional()
  @IsString()
  icmsRate?: string;

  @IsOptional()
  @IsString()
  ipiRate?: string;

  @IsOptional()
  @IsString()
  pisCst?: string;

  @IsOptional()
  @IsString()
  pisRate?: string;

  @IsOptional()
  @IsString()
  cofinsCst?: string;

  @IsOptional()
  @IsString()
  cofinsRate?: string;

  @IsOptional()
  @IsString()
  issRate?: string;
}

class CreateFiscalDocumentDto {
  @IsEnum(FiscalDocumentType)
  documentType!: FiscalDocumentType;

  @IsOptional()
  @IsString()
  seriesId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  customerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  customerTaxId?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsObject()
  customerAddress?: Record<string, string>;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FiscalDocumentItemDto)
  items!: FiscalDocumentItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

@Controller('erp/fiscal')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Post('series')
  @Roles('admin', 'engineer')
  createSeries(@TenantContext() tc: ITenantContext, @Body() dto: CreateSeriesDto) {
    return this.fiscalService.createSeries(tc.tenantId, dto);
  }

  @Get('series')
  @Roles('admin', 'engineer', 'sales')
  listSeries(
    @TenantContext() tc: ITenantContext,
    @Query('documentType') documentType?: FiscalDocumentType,
  ) {
    return this.fiscalService.listSeries(tc.tenantId, documentType);
  }

  @Post('documents')
  @Roles('admin', 'engineer')
  createDocument(@TenantContext() tc: ITenantContext, @Body() dto: CreateFiscalDocumentDto) {
    return this.fiscalService.createDocument(tc.tenantId, dto);
  }

  @Get('documents')
  @Roles('admin', 'engineer', 'sales')
  listDocuments(
    @TenantContext() tc: ITenantContext,
    @Query('status') status?: FiscalDocumentStatus,
    @Query('documentType') documentType?: FiscalDocumentType,
  ) {
    return this.fiscalService.listDocuments(tc.tenantId, status, documentType);
  }

  @Get('documents/:id')
  @Roles('admin', 'engineer', 'sales')
  getDocument(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.fiscalService.getDocument(tc.tenantId, id);
  }

  @Patch('documents/:id/cancel')
  @Roles('admin')
  cancelDocument(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.fiscalService.cancelDocument(tc.tenantId, id);
  }
}
