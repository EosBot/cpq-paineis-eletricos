# ADR-0001: Multi-Tenant Marketplace Isolation

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The platform is a multi-tenant marketplace where multiple sellers (merchants) operate isolated storefronts. Each seller has their own customers, products, orders, and ERP data. The platform must ensure complete data isolation between tenants while allowing shared infrastructure.

## Decision

Use row-level tenant isolation via a `tenantId` column on all tenant-scoped tables. This is enforced by:

1. **Prisma Middleware** (`prisma-tenant-scope.ts`): Automatically injects `tenantId` filter on all queries
2. **PostgreSQL RLS**: Row-Level Security policies as defense-in-depth
3. **JWT-derived tenant**: Tenant context comes from the authenticated JWT, never from client input
4. **Global interceptor**: `TenantScopeInterceptor` extracts tenant from JWT and sets Prisma context

### Tenant Model

Each tenant represents a seller/merchant with:
- Own storefront (custom domain, branding, products)
- Isolated ERP (inventory, orders, customers, financial)
- Configurable feature flags (CPQ module can be enabled/disabled)
- Subscription plan (limits, billing)

### Data Isolation Boundary

```
Tenant (Seller/Merchant)
├── Storefront (products, categories, branding)
├── Customers (buyer accounts)
├── Orders (from storefront)
├── Inventory (stock management)
├── Financial (accounts, transactions)
├── CPQ Data (components, configurations, rules)
└── Users (staff accounts with roles)
```

## Consequences

### Positive
- Complete data isolation between sellers
- Shared infrastructure reduces costs
- Easy to migrate to schema-per-tenant or database-per-tenant in future
- Tenant context is security-enforced, not convention-enforced

### Negative
- All queries must include `tenantId` filter
- Cross-tenant analytics require special handling
- Database backups are per-database, not per-tenant

## References

- `apps/api/src/tenancy/prisma-tenant-scope.ts` — Middleware
- `apps/api/src/tenancy/tenant-scope.interceptor.ts` — Interceptor
- `apps/api/src/tenancy/tenant-context.ts` — Context interface
- `apps/api/prisma/migrations/20260720000000_rls_tenant_isolation` — RLS migration
