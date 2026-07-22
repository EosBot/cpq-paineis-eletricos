import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { FinancialService } from './financial.service';

class CreateAccountDto {
  code!: string;
  name!: string;
  type!: AccountType;
  parentAccountId?: string;
  isAnalytical?: boolean;
}

class CreateTransactionDto {
  accountId!: string;
  type!: string;
  amount!: string;
  direction!: 'CREDIT' | 'DEBIT';
  dueDate?: string;
  paidDate?: string;
  referenceType?: string;
  referenceId?: string;
  description?: string;
  counterpartName?: string;
  counterpartTaxId?: string;
  paymentMethod?: string;
  notes?: string;
}

class ImportBankTransactionsDto {
  bankAccountId!: string;
  transactions!: Array<{
    transactionDate: string;
    description?: string;
    amount: string;
    direction: 'CREDIT' | 'DEBIT';
    fitid?: string;
  }>;
}

@Controller('erp/financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('accounts')
  createAccount(@Body() dto: CreateAccountDto, @Query('tenantId') tenantId: string) {
    return this.financialService.createAccount(tenantId, dto);
  }

  @Get('accounts')
  listAccounts(
    @Query('tenantId') tenantId: string,
    @Query('type') type?: AccountType,
  ) {
    return this.financialService.listAccounts(tenantId, type);
  }

  @Post('transactions')
  createTransaction(
    @Body() dto: CreateTransactionDto,
    @Query('tenantId') tenantId: string,
  ) {
    return this.financialService.createTransaction(tenantId, dto);
  }

  @Get('transactions')
  listTransactions(
    @Query('tenantId') tenantId: string,
    @Query('accountId') accountId?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.financialService.listTransactions(tenantId, {
      accountId,
      status,
      fromDate,
      toDate,
    });
  }

  @Get('aging-report')
  getAgingReport(@Query('tenantId') tenantId: string) {
    return this.financialService.getAgingReport(tenantId);
  }

  @Post('bank-accounts')
  createBankAccount(
    @Body() dto: { name: string; bankCode?: string; agency?: string; accountNumber?: string },
    @Query('tenantId') tenantId: string,
  ) {
    return this.financialService.createBankAccount(tenantId, dto);
  }

  @Get('bank-accounts')
  listBankAccounts(@Query('tenantId') tenantId: string) {
    return this.financialService.listBankAccounts(tenantId);
  }

  @Post('bank-accounts/import')
  importBankTransactions(
    @Body() dto: ImportBankTransactionsDto,
    @Query('tenantId') tenantId: string,
  ) {
    return this.financialService.importBankTransactions(
      tenantId,
      dto.bankAccountId,
      dto.transactions,
    );
  }

  @Get('bank-accounts/:id/reconciliation')
  getBankReconciliation(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.financialService.getBankReconciliation(tenantId, id);
  }
}
