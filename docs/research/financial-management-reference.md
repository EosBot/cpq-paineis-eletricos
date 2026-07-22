# Financial Management Module — Reference Design

> NestJS + PostgreSQL + Prisma. Tenant-isolated via `tenantId` (row-level security).

## 1. Chart of Accounts (Plano de Contas)

CPC/IFRS-aligned. Self-referencing hierarchy with `level` + `parentId`.

**Account Types**: `ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE`

**Hierarchy** (synthetic ? analytical):
- L1: `1` (Ativo), `2` (Passivo), `3` (PL)
- L2: `1.1` (Ativo Circulante)
- L3: `1.1.1` (Caixa) — **synthetic** (rolls up children)
- L4: `1.1.1.001` (Banco X) — **analytical** (accepts entries)

## 2. Key Entity Fields

```
FinancialAccount { id, tenantId, code, name, type, level, parentId,
  isAnalytical, nature (DEBIT|CREDIT), isActive }

JournalEntry { id, tenantId, date, amount (Decimal 18,4), accountId,
  description, referenceType, referenceId, postedAt, postedById }

Invoice { id, tenantId, customerAccountId, type (RECEIVABLE|PAYABLE),
  installmentNumber, dueDate, paidDate, principalAmount, lateFeeAmount,
  interestAmount, status (PENDING|PARTIAL|PAID|OVERDUE|CANCELLED),
  paymentMethod (PIX|BOLETO|CREDIT_CARD|TRANSFER), bankAccountId }

BankAccount { id, tenantId, bankCode, agency, accountNumber,
  openingBalance, currentBalance, lastReconciliationDate }

BankTransaction { id, tenantId, bankAccountId, date, amount, description,
  fitId, status (UNRECONCILED|RECONCILED|IGNORED), matchedJournalEntryId? }
```

## 3. Double-Entry Pattern

Every event produces balanced entries (Sdebits = Scredits):

| Event | Debit | Credit |
|-------|-------|--------|
| Sale on credit | `1.1.3 — Contas a Receber` | `4.1.1 — Receita Vendas` |
| Customer payment | `1.1.1 — Caixa/Banco` | `1.1.3 — Contas a Receber` |
| Late interest | `1.1.1 — Caixa` | `4.2.1 — Receita Juros` |
| Supplier payment | `2.1.1 — Fornecedores` | `1.1.1 — Caixa/Banco` |

`JournalEntryService.post()` validates balance before `prisma.$transaction`.

## 4. Accounts Receivable / Payable

**Aging**: `A_VENCER` (dueDate = today), `VENCIDO` (dueDate < today, unpaid), `EM_ATRASO` (past grace period).

**Late Fees** (CET-compliant): 2% flat late fee + 1% monthly interest (pro rata die).

## 5. Bank Reconciliation Workflow

**State Machine**: `UNRECONCILED ? MATCHED ? RECONCILED` (or `IGNORED`).

**Import**: OFX (ISO 20022) or CSV via `BankStatementParser` adapter.

**Auto-Matching** (priority): (1) Exact: amount + date + fitId, (2) Fuzzy: amount ±0.01 + date ±2d, (3) Manual.

**Flow**: Import ? auto-match ? user confirm ? generate `JournalEntry` ? update `BankAccount.currentBalance`.

## 6. Cash Flow Projection

**Daily**: Opening balance + inflows (receivables due) - outflows (payables due) = Closing balance.

Source: `BankAccount.openingBalance` + cleared `BankTransaction` + `Invoice` due in window. Materialized view `mv_cash_flow_daily` refreshed every 15min.

## 7. Financial Reports

| Report | Source | Strategy |
|--------|--------|----------|
| **Balanço Patrimonial** | Account balances by type | Sum entries; validate `A = L + E` |
| **DRE** | `REVENUE`/`EXPENSE` entries | Period comparison |
| **Trial Balance** | All analytical accounts | Sdebits = Scredits per period |

Reports use **read replica** (`@ReadReplica()`) for isolation from writes.

## 8. Brazilian Payment Methods

| Method | Key Fields | Lifecycle |
|--------|-----------|-----------|
| **PIX** | `pixKey`, `pixTxId` | Immediate `PAID` via webhook |
| **Boleto** | `boletoBarcode`, `dueDate` | Issued ? Registered ? Paid |
| **Credit Card** | `cardLast4`, `installments` | Authorized ? Captured |
| **TED/DOC** | `destinationAccount` | Initiated ? Confirmed |

`PaymentMethodHandler` strategy: `register()`, `confirm()`, `cancel()`.

## 9. Module Structure

```
financial/
+-- chart-of-accounts/     # CRUD + hierarchy
+-- journal-entries/       # Double-entry posting
+-- accounts-receivable/   # Aging + collections
+-- accounts-payable/      # Payment scheduling
+-- bank-reconciliation/   # OFX/CSV + matching
+-- cash-flow/             # Daily projection
+-- reports/               # Balance Sheet, DRE, Trial Balance
+-- payment-methods/       # PIX, boleto, credit card
```

All modules follow existing patterns: `PrismaModule`, `ITenantContext`, `$transactionWithRLS`, tenant-scoped queries.
