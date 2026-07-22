import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountType } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDecimal,
  IsIn,
  IsISO8601,
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
import { FinancialService } from './financial.service';

const ACCOUNT_TYPES = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] as const;

class CreateAccountDto {
  @IsString()
  @MaxLength(40)
  code!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsIn(ACCOUNT_TYPES)
  type!: string;

  @IsOptional()
  @IsString()
  parentAccountId?: string;

  @IsOptional()
  @IsBoolean()
  isAnalytical?: boolean;
}

class CreateTransactionDto {
  @IsString()
  accountId!: string;

  @IsString()
  @MaxLength(40)
  type!: string;

  @IsDecimal({ decimal_digits: '0,4' })
  amount!: string;

  @IsIn(['CREDIT', 'DEBIT'])
  direction!: 'CREDIT' | 'DEBIT';

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsISO8601()
  paidDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  referenceType?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  counterpartName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  counterpartTaxId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

class CreateBankAccountDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bankCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  agency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  accountNumber?: string;
}

class BankTransactionItemDto {
  @IsISO8601()
  transactionDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsDecimal({ decimal_digits: '0,4' })
  amount!: string;

  @IsIn(['CREDIT', 'DEBIT'])
  direction!: 'CREDIT' | 'DEBIT';

  @IsOptional()
  @IsString()
  @MaxLength(60)
  fitid?: string;
}

class ImportBankTransactionsDto {
  @IsString()
  bankAccountId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BankTransactionItemDto)
  transactions!: BankTransactionItemDto[];
}

@Controller('erp/financial')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('accounts')
  @Roles('admin')
  createAccount(@TenantContext() tc: ITenantContext, @Body() dto: CreateAccountDto) {
    return this.financialService.createAccount(tc.tenantId, dto);
  }

  @Get('accounts')
  @Roles('admin', 'engineer', 'sales')
  listAccounts(
    @TenantContext() tc: ITenantContext,
    @Query('type') type?: AccountType,
  ) {
    return this.financialService.listAccounts(tc.tenantId, type);
  }

  @Post('transactions')
  @Roles('admin')
  createTransaction(@TenantContext() tc: ITenantContext, @Body() dto: CreateTransactionDto) {
    return this.financialService.createTransaction(tc.tenantId, dto);
  }

  @Get('transactions')
  @Roles('admin', 'engineer', 'sales')
  listTransactions(
    @TenantContext() tc: ITenantContext,
    @Query('accountId') accountId?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.financialService.listTransactions(tc.tenantId, {
      accountId,
      status,
      fromDate,
      toDate,
    });
  }

  @Get('aging-report')
  @Roles('admin', 'sales')
  getAgingReport(@TenantContext() tc: ITenantContext) {
    return this.financialService.getAgingReport(tc.tenantId);
  }

  @Post('bank-accounts')
  @Roles('admin')
  createBankAccount(
    @TenantContext() tc: ITenantContext,
    @Body() dto: CreateBankAccountDto,
  ) {
    return this.financialService.createBankAccount(tc.tenantId, dto);
  }

  @Get('bank-accounts')
  @Roles('admin', 'engineer', 'sales')
  listBankAccounts(@TenantContext() tc: ITenantContext) {
    return this.financialService.listBankAccounts(tc.tenantId);
  }

  @Post('bank-accounts/import')
  @Roles('admin')
  importBankTransactions(
    @TenantContext() tc: ITenantContext,
    @Body() dto: ImportBankTransactionsDto,
  ) {
    return this.financialService.importBankTransactions(
      tc.tenantId,
      dto.bankAccountId,
      dto.transactions,
    );
  }

  @Get('bank-accounts/:id/reconciliation')
  @Roles('admin')
  getBankReconciliation(
    @TenantContext() tc: ITenantContext,
    @Param('id') id: string,
  ) {
    return this.financialService.getBankReconciliation(tc.tenantId, id);
  }
}
