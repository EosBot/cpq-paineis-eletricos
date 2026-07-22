-- CreateEnum
CREATE TYPE "FiscalDocumentType" AS ENUM ('NFE', 'NFCE', 'NFSE', 'INVOICE');

-- CreateEnum
CREATE TYPE "FiscalDocumentStatus" AS ENUM ('RASCUNHO', 'PROCESSANDO', 'AUTORIZADO', 'CANCELADO', 'CORRIGIDO');

-- CreateEnum
CREATE TYPE "FiscalRegime" AS ENUM ('NORMAL', 'SIMPLES_NACIONAL');

-- CreateEnum
CREATE TYPE "FiscalCST" AS ENUM ('CST_00', 'CST_10', 'CST_20', 'CST_30', 'CST_40', 'CST_41', 'CST_50', 'CST_51', 'CST_60', 'CST_70', 'CST_90', 'CST_101', 'CST_102', 'CST_103', 'CST_201', 'CST_202', 'CST_203', 'CST_300', 'CST_400', 'CST_500', 'CST_900');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FinancialTransactionStatus" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('NAO_CONCILIADO', 'CONCILIADO', 'DIVERGENTE');

-- CreateTable
CREATE TABLE "FiscalSeries" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "documentType" "FiscalDocumentType" NOT NULL,
    "nextNumber" INTEGER NOT NULL DEFAULT 1,
    "environment" VARCHAR(1) NOT NULL DEFAULT '2',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiscalSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalDocument" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "seriesId" TEXT,
    "documentType" "FiscalDocumentType" NOT NULL,
    "status" "FiscalDocumentStatus" NOT NULL DEFAULT 'RASCUNHO',
    "seriesCode" VARCHAR(20),
    "documentNumber" INTEGER,
    "chaveAcesso" VARCHAR(44),
    "customerId" TEXT,
    "customerName" VARCHAR(160),
    "customerTaxId" VARCHAR(20),
    "customerEmail" VARCHAR(320),
    "customerAddress" JSONB,
    "issuerName" VARCHAR(160),
    "issuerTaxId" VARCHAR(20),
    "issuerAddress" JSONB,
    "totalAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "xmlContent" TEXT,
    "xmlProtocol" VARCHAR(44),
    "qrCodeUrl" VARCHAR(500),
    "pdfUrl" VARCHAR(500),
    "issueDate" TIMESTAMP(3),
    "cancellationDate" TIMESTAMP(3),
    "correctionLetter" TEXT,
    "gateway" VARCHAR(40) NOT NULL DEFAULT 'SELF',
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiscalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalDocumentId" TEXT NOT NULL,
    "productId" TEXT,
    "itemNumber" INTEGER NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "ncmCode" VARCHAR(20),
    "cfopCode" VARCHAR(10) NOT NULL,
    "unit" VARCHAR(10) NOT NULL DEFAULT 'UN',
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "totalPrice" DECIMAL(18,4) NOT NULL,
    "discount" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "icmsCst" VARCHAR(10),
    "icmsBase" DECIMAL(18,4),
    "icmsRate" DECIMAL(18,4),
    "icmsValue" DECIMAL(18,4),
    "ipiRate" DECIMAL(18,4),
    "ipiValue" DECIMAL(18,4),
    "pisCst" VARCHAR(10),
    "pisBase" DECIMAL(18,4),
    "pisRate" DECIMAL(18,4),
    "pisValue" DECIMAL(18,4),
    "cofinsCst" VARCHAR(10),
    "cofinsBase" DECIMAL(18,4),
    "cofinsRate" DECIMAL(18,4),
    "cofinsValue" DECIMAL(18,4),
    "issRate" DECIMAL(18,4),
    "issValue" DECIMAL(18,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FiscalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" VARCHAR(120) NOT NULL,
    "taxType" VARCHAR(20) NOT NULL,
    "rate" DECIMAL(18,4) NOT NULL,
    "state" VARCHAR(2),
    "ncmCode" VARCHAR(20),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialAccount" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" "AccountType" NOT NULL,
    "parentAccountId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isAnalytical" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "referenceType" VARCHAR(60),
    "referenceId" TEXT,
    "type" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "direction" VARCHAR(10) NOT NULL,
    "status" "FinancialTransactionStatus" NOT NULL DEFAULT 'PENDENTE',
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "description" VARCHAR(300),
    "counterpartName" VARCHAR(160),
    "counterpartTaxId" VARCHAR(20),
    "paymentMethod" VARCHAR(40),
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "bankCode" VARCHAR(10),
    "agency" VARCHAR(20),
    "accountNumber" VARCHAR(20),
    "balance" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "lastSyncAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankTransaction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(300),
    "amount" DECIMAL(18,4) NOT NULL,
    "direction" VARCHAR(10) NOT NULL,
    "fitid" VARCHAR(120),
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'NAO_CONCILIADO',
    "matchedTransactionId" TEXT,
    "notes" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FiscalSeries_tenantId_documentType_idx" ON "FiscalSeries"("tenantId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "FiscalSeries_tenantId_code_key" ON "FiscalSeries"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "FiscalDocument_chaveAcesso_key" ON "FiscalDocument"("chaveAcesso");

-- CreateIndex
CREATE INDEX "FiscalDocument_tenantId_status_idx" ON "FiscalDocument"("tenantId", "status");

-- CreateIndex
CREATE INDEX "FiscalDocument_chaveAcesso_idx" ON "FiscalDocument"("chaveAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "FiscalDocument_tenantId_documentType_seriesCode_documentNum_key" ON "FiscalDocument"("tenantId", "documentType", "seriesCode", "documentNumber");

-- CreateIndex
CREATE INDEX "FiscalItem_tenantId_fiscalDocumentId_idx" ON "FiscalItem"("tenantId", "fiscalDocumentId");

-- CreateIndex
CREATE INDEX "TaxRate_tenantId_taxType_idx" ON "TaxRate"("tenantId", "taxType");

-- CreateIndex
CREATE UNIQUE INDEX "TaxRate_tenantId_code_state_key" ON "TaxRate"("tenantId", "code", "state");

-- CreateIndex
CREATE INDEX "FinancialAccount_tenantId_type_idx" ON "FinancialAccount"("tenantId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialAccount_tenantId_code_key" ON "FinancialAccount"("tenantId", "code");

-- CreateIndex
CREATE INDEX "FinancialTransaction_tenantId_accountId_idx" ON "FinancialTransaction"("tenantId", "accountId");

-- CreateIndex
CREATE INDEX "FinancialTransaction_tenantId_status_idx" ON "FinancialTransaction"("tenantId", "status");

-- CreateIndex
CREATE INDEX "FinancialTransaction_tenantId_dueDate_idx" ON "FinancialTransaction"("tenantId", "dueDate");

-- CreateIndex
CREATE INDEX "FinancialTransaction_referenceType_referenceId_idx" ON "FinancialTransaction"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "BankAccount_tenantId_idx" ON "BankAccount"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_tenantId_bankCode_agency_accountNumber_key" ON "BankAccount"("tenantId", "bankCode", "agency", "accountNumber");

-- CreateIndex
CREATE INDEX "BankTransaction_tenantId_bankAccountId_status_idx" ON "BankTransaction"("tenantId", "bankAccountId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BankTransaction_tenantId_bankAccountId_fitid_key" ON "BankTransaction"("tenantId", "bankAccountId", "fitid");

-- AddForeignKey
ALTER TABLE "FiscalSeries" ADD CONSTRAINT "FiscalSeries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalDocument" ADD CONSTRAINT "FiscalDocument_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalDocument" ADD CONSTRAINT "FiscalDocument_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "FiscalSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalItem" ADD CONSTRAINT "FiscalItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalItem" ADD CONSTRAINT "FiscalItem_fiscalDocumentId_fkey" FOREIGN KEY ("fiscalDocumentId") REFERENCES "FiscalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRate" ADD CONSTRAINT "TaxRate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAccount" ADD CONSTRAINT "FinancialAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAccount" ADD CONSTRAINT "FinancialAccount_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "FinancialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
