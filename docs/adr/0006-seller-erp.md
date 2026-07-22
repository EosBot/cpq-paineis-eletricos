# ADR-0006: Seller ERP Panel

**Status**: Accepted  
**Date**: 2026-07-22

## Context

Each seller (tenant) needs a comprehensive ERP panel to manage their marketplace operations. This includes product management, order fulfillment, inventory control, customer management, and financial tracking.

## Decision

Build a seller ERP dashboard as part of the Next.js frontend, accessible at `/seller`. The dashboard is tenant-scoped — sellers only see their own data.

### Architecture

```
Seller ERP (/seller)
├── Dashboard — Overview with KPIs and charts
├── Products — CRUD for products + categories
├── Orders — Order management and fulfillment
├── Inventory — Stock management
├── Customers — Customer database
├── Financial — Accounts, transactions, reports
└── Settings — Store configuration
```

### Modules

#### 1. Dashboard
- Sales metrics (today, week, month)
- Pending orders count
- Low stock alerts
- Recent activity feed

#### 2. Products Management
```typescript
Seller Product API:
  POST   /seller/products           — Create product
  PATCH  /seller/products/:id       — Update product
  DELETE /seller/products/:id       — Delete product
  POST   /seller/products/:id/images — Upload images
  GET    /seller/categories         — List categories
  POST   /seller/categories         — Create category
```

#### 3. Orders Management
```typescript
Seller Order API:
  GET    /seller/orders             — List orders (filters, pagination)
  GET    /seller/orders/:id         — Order detail
  POST   /seller/orders/:id/confirm — Confirm order
  POST   /seller/orders/:id/advance — Advance status
  POST   /seller/orders/:id/cancel  — Cancel order
```

#### 4. Inventory Management
```typescript
Seller Inventory API:
  GET    /seller/inventory          — Stock levels
  POST   /seller/inventory/movements — Record stock movement
  GET    /seller/inventory/alerts   — Low stock alerts
```

#### 5. Customers
```typescript
Seller Customer API:
  GET    /seller/customers          — List customers
  GET    /seller/customers/:id      — Customer detail + order history
  POST   /seller/customers          — Create customer (manual)
```

#### 6. Financial
```typescript
Seller Financial API:
  GET    /seller/financial/accounts — Chart of accounts
  POST   /seller/financial/transactions — Record transaction
  GET    /seller/financial/reports/aging — Aging report
  GET    /seller/financial/reports/cashflow — Cash flow
```

### RBAC (Roles)

Seller staff have roles:
- `admin` — Full access to all ERP functions
- `manager` — Orders, inventory, customers (no financial)
- `operator` — Orders and inventory only
- `viewer` — Read-only access

### UI Structure

```
apps/web/src/app/seller/
├── layout.tsx              # Seller layout with sidebar
├── page.tsx                # Dashboard
├── products/
│   ├── page.tsx            # Product list
│   ├── new/page.tsx        # Create product
│   └── [id]/page.tsx       # Edit product
├── orders/
│   ├── page.tsx            # Order list
│   └── [id]/page.tsx       # Order detail
├── inventory/
│   └── page.tsx            # Stock levels
├── customers/
│   ├── page.tsx            # Customer list
│   └── [id]/page.tsx       # Customer detail
├── financial/
│   └── page.tsx            # Financial overview
└── settings/
    └── page.tsx            # Store settings
```

## Consequences

### Positive
- Sellers have complete control over their operations
- Integrated with marketplace order flow
- Role-based access for seller staff
- Extensible module architecture

### Negative
- Large surface area to build and maintain
- Each module needs full CRUD + validation
- Financial module requires careful audit trail
- UI consistency across modules is challenging
