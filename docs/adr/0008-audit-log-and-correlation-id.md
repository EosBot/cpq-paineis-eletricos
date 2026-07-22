# ADR 0008 – Audit Log & Correlation ID

## Status
Accepted

## Context
The CPQ system is a multi-tenant SaaS handling high-value commercial workflows
(quotes, configurations, BOM, orders, shipments). Operators and customers need
a tamper-evident, queryable trail of who did what, when, and under which
request — both for compliance and for incident investigation.

Additionally, distributed debugging across interceptors, services, and the
database requires a single identifier that travels with a request end-to-end.

Key requirements:
- Audit entries must be **tenant-scoped** (never leak across tenants).
- Audit writes must **never break** the business response (best-effort, async).
- The actor (`userId`) and tenant (`tenantId`) must come from the verified
  JWT, never from client-supplied headers.
- A correlation id must be present on every response and in every log line and
  audit entry, so a single request can be traced across the stack.

## Decision
We implement two complementary, low-overhead subsystems:

### 1. Correlation ID
- A `CorrelationIdInterceptor` (global, highest priority) generates a UUID v4
  when the inbound `X-Correlation-ID` header is absent, and stores it in an
  `AsyncLocalStorage` cell (`correlation-id.storage.ts`).
- The id is echoed back on every response via `X-Correlation-ID`.
- `StructuredLogger` reads the storage cell and injects `correlationId` (and
  `tenantId`) into every JSON log line.
- The same storage cell is read by `AuditInterceptor` so the audit row carries the
  correlation id that produced it.

### 2. Audit Log
- Dedicated `AuditLog` model in `schema.prisma`, registered in
  `tenant-scope-registry.ts` so it is automatically filtered by `tenantId`
  (consistent with the tenant-isolation strategy in ADR 0001).
- A global `AuditInterceptor` maps mutating routes (POST) to audit actions via
  `audit-route-map.ts` (e.g. `POST:/quotes` → `CREATE_QUOTE`).
  - Route resolution **always strips** the global prefix `/api/v1` from both
    `request.route.path` and `request.url`, because Express may or may not
    include the prefix depending on how Nest registers the route.
  - Parameterized routes (`/quotes/:quoteId/calculate`) are matched by
    segment comparison, not exact string equality.
- The interceptor is **fire-and-forget**: it persists inside `tap(next)` of the
  response stream. Persistence failures are logged, never thrown to the client.
- Entity id resolution is declarative per route: `result` (response body `id`),
  `body` (request field), or `param` (route param).
- Read endpoints (GET) and routes outside the map are not audited. Requests
  without a tenant context (e.g. `POST /auth/login`) are skipped.

### 3. Exposure
- `GET /api/v1/audit-logs` (admin-only via `RolesGuard`) lists entries for
  the caller's tenant, with pagination (`limit`/`offset`), filtering by
  `entityType`/`action`/`actorUserId`/`correlationId`, and sorting by
  `createdAt desc`.
- Swagger/OpenAPI documents the endpoint (`@ApiTags('Audit')`,
  `@ApiBearerAuth()`); UI at `GET /api/docs`, spec at `GET /api/docs-json`,
  and a generated `openapi.yaml` via `pnpm --filter api openapi`.

### 4. CORS
- `CORS_ORIGIN` (comma-separated) drives `app.enableCors`. The policy is
  **fail-closed**: with no value, CORS is disabled. `credentials: true` is
  used only with explicit origins — never `*` — to avoid the insecure
  wildcard-with-credentials combination.

## Consequences
- Every mutating, tenant-scoped operation now produces a queryable audit row
  linked to the request correlation id.
- Audit failures are isolated from business logic; a DB outage degrades logging,
  not the API.
- Added a new migration (`20260717030000_add_audit_log`) and a new table;
  the tenant-scope registry grew by one entry.
- Route-map maintenance: new mutating endpoints must be added to
  `audit-route-map.ts` to be audited (YAGNI: we audit the vertical's
  write surface, not every endpoint).
- Correlation id is now a first-class observability primitive reused by logs and
  audit, reducing mean-time-to-debug for cross-cutting issues.
