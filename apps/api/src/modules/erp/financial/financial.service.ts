import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(tenantId: string, data: {
    code: string;
    name: string;
    type: string;
    parentAccountId?: string;
    isAnalytical?: boolean;
  }) {
    const existing = await this.prisma.financialAccount.findUnique({
      where: { tenantId_code: { tenantId, code: data.code } },
    });
    if (existing) {
      throw new BadRequestException('Account code already exists.');
    }

    return this.prisma.financialAccount.create({
      data: {
        tenantId,
        code: data.code,
        name: data.name,
        type: data.type as AccountType,
        parentAccountId: data.parentAccountId,
        level: 1,
        isAnalytical: data.isAnalytical ?? true,
      },
    });
  }

  async listAccounts(tenantId: string, type?: AccountType) {
    return this.prisma.financialAccount.findMany({
      where: {
        tenantId,
        ...(type ? { type } : {}),
      },
      orderBy: { code: 'asc' },
    });
  }

  async createTransaction(tenantId: string, data: {
    accountId: string;
    type: string;
    amount: string;
    direction: 'CREDIT' | 'DEBIT';
    dueDate?: string;
    paidDate?: string;
    referenceType?: string;
    referenceId?: string;
    description?: string;
    counterpartName?: string;
    counterpartTaxId?: string;
    paymentMethod?: string;
    notes?: string;
  }) {
    const account = await this.prisma.financialAccount.findFirst({
      where: { id: data.accountId, tenantId },
    });
    if (!account) throw new NotFoundException('Financial account not found.');
    if (!account.isAnalytical) {
      throw new BadRequestException('Transactions can only be posted to analytical accounts.');
    }

    return this.prisma.financialTransaction.create({
      data: {
        tenantId,
        accountId: data.accountId,
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        direction: data.direction,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        description: data.description,
        counterpartName: data.counterpartName,
        counterpartTaxId: data.counterpartTaxId,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
    });
  }

  async listTransactions(tenantId: string, filters?: {
    accountId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    return this.prisma.financialTransaction.findMany({
      where: {
        tenantId,
        ...(filters?.accountId ? { accountId: filters.accountId } : {}),
        ...(filters?.status ? { status: filters.status as any } : {}),
        ...(filters?.fromDate || filters?.toDate
          ? {
              createdAt: {
                ...(filters.fromDate ? { gte: new Date(filters.fromDate) } : {}),
                ...(filters.toDate ? { lte: new Date(filters.toDate) } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAgingReport(tenantId: string) {
    const now = new Date();
    const transactions = await this.prisma.financialTransaction.findMany({
      where: {
        tenantId,
        status: 'PENDENTE',
        direction: 'CREDIT',
      },
      orderBy: { dueDate: 'asc' },
    });

    return transactions.map((t) => {
      const dueDate = t.dueDate ?? t.createdAt;
      const daysOverdue = Math.max(
        0,
        Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)),
      );

      return {
        id: t.id,
        description: t.description,
        counterpartName: t.counterpartName,
        amount: t.amount,
        dueDate,
        daysOverdue,
        category: daysOverdue === 0 ? 'A_VENCER' : daysOverdue <= 30 ? 'VENCIDO_30' : 'VENCIDO_MAIS_30',
      };
    });
  }

  async createBankAccount(tenantId: string, data: {
    name: string;
    bankCode?: string;
    agency?: string;
    accountNumber?: string;
  }) {
    return this.prisma.bankAccount.create({
      data: {
        tenantId,
        name: data.name,
        bankCode: data.bankCode,
        agency: data.agency,
        accountNumber: data.accountNumber,
      },
    });
  }

  async listBankAccounts(tenantId: string) {
    return this.prisma.bankAccount.findMany({
      where: { tenantId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async importBankTransactions(tenantId: string, bankAccountId: string, transactions: Array<{
    transactionDate: string;
    description?: string;
    amount: string;
    direction: 'CREDIT' | 'DEBIT';
    fitid?: string;
  }>) {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: { id: bankAccountId, tenantId },
    });
    if (!bankAccount) throw new NotFoundException('Bank account not found.');

    return this.prisma.$transaction(
      transactions.map((t) =>
        this.prisma.bankTransaction.create({
          data: {
            tenantId,
            bankAccountId,
            transactionDate: new Date(t.transactionDate),
            description: t.description,
            amount: new Prisma.Decimal(t.amount),
            direction: t.direction,
            fitid: t.fitid,
          },
        }),
      ),
    );
  }

  async getBankReconciliation(tenantId: string, bankAccountId: string) {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: { id: bankAccountId, tenantId },
    });
    if (!bankAccount) throw new NotFoundException('Bank account not found.');

    const [transactions, bankTrans] = await Promise.all([
      this.prisma.financialTransaction.findMany({
        where: { tenantId, status: 'PENDENTE' },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bankTransaction.findMany({
        where: { tenantId, bankAccountId, status: 'NAO_CONCILIADO' },
        orderBy: { transactionDate: 'desc' },
      }),
    ]);

    return {
      bankAccount: {
        id: bankAccount.id,
        name: bankAccount.name,
        balance: bankAccount.balance,
      },
      pendingTransactions: transactions,
      unreconciledBankTransactions: bankTrans,
    };
  }
}
