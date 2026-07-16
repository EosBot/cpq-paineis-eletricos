# ADR 0001 - Tenant boundary and isolation

## Status
Accepted

## Context
The system is a SaaS CPQ for electrical panel manufacturers. The domain requires multi-tenancy, but the contract prioritizes low operational cost, scalability, and future evolution. We needed to define both the business meaning of a tenant and the initial isolation strategy.

## Decision
- Each `Tenant` represents one manufacturer.
- Catalog, customers, rules, configurations, quotes, BOMs, orders, and memberships are scoped to one tenant.
- The initial persistence model uses row-level isolation with `tenantId`.
- The architecture must preserve a migration path to stronger isolation models later, such as schema-per-tenant or database-per-tenant.

## Consequences
### Positive
- Fits the hybrid business model where each manufacturer owns its own catalog and commercial space.
- Keeps the initial operational model simpler and cheaper than schema-per-tenant or database-per-tenant.
- Preserves future hardening without breaking the domain language.

### Negative
- Every tenant-scoped aggregate must enforce isolation consistently.
- Future migration to stronger isolation will require planned infrastructure and data movement.

## Alternatives considered
- Schema-per-tenant
- Database-per-tenant
- Single-tenant system
