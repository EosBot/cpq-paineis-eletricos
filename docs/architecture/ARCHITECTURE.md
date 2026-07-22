# Architecture Reference — CPQ Marketplace

> **Objetivo**: Documento de referência arquitetural do marketplace. Visão consolidada das decisões, padrões e estrutura do sistema.

---

## 1. Visão Geral da Arquitetura

### Padrão Arquitetural

**Monolito Modular** com separação clara por bounded contexts. Cada módulo NestJS é um vertical slice completo.

### Por que Monolito Modular?

| Fator | Decisão |
|-------|---------|
| **Tamanho do time** | 1-2 desenvolvedores → monolito é mais produtivo |
| **Complexidade** | Microserviços adicionam overhead operacional desnecessário |
| **Deploy** | Single deploy unit simplifica CI/CD |
| **Transações** | ACID via PostgreSQL → sem necessidade de sagas distribuídas |
| **Evolução** | Módulos isolados permitem extração futura para microserviços |

### Princípios

1. **Tenant isolation first**: Todo dado pertence a um tenant
2. **Defense in depth**: Security em múltiplas camadas
3. **API-first**: Backend RESTful com OpenAPI
4. **Frontend compartilhado**: 3 apps compartilhando UI components
5. **Database as service**: PostgreSQL para tudo (relacional + JSONB)

---

## 2. Backend Architecture (NestJS)

### Module Organization

```
apps/api/src/
├── auth/                    # Authentication & authorization
├── tenancy/                 # Tenant isolation middleware
├── common/                  # Shared utilities (interceptors, guards, pipes)
├── modules/
│   ├── marketplace/         # Products, categories
│   ├── cart/                # Shopping cart
│   ├── orders/              # Order lifecycle
│   ├── cpq/                 # CPQ configurations
│   ├── seller/              # Seller ERP
│   ├── admin/               # Platform admin
│   ├── platform/            # Plans, subscriptions, billing
│   ├── erp/                 # Fiscal, financial, inventory, procurement
│   └── privacy/             # LGPD compliance
├── prisma/                  # Prisma service & middleware
└── test/                    # Test utilities
```

### Request Flow

```
Client Request
    ↓
nginx (reverse proxy)
    ↓
NestJS Bootstrap
    ├── helmet (security headers)
    ├── CORS
    ├── Body Parser (JSON)
    ├── Correlation ID Interceptor
    └── Tenant Scope Interceptor
        ↓
    Route Handler
        ├── AuthGuard (JWT validation)
        ├── RolesGuard (RBAC check)
        ├── ValidationPipe (DTO validation)
        └── Controller → Service → Prisma → Database
            ↓
        Response
```

### Multi-Tenant Isolation

**Row-Level Security** via `tenantId`:

```typescript
// 1. JWT contains tenantId
// 2. Interceptor extracts tenantId from JWT
// 3. Prisma middleware injects tenantId filter
// 4. PostgreSQL RLS enforces at DB level
```

### Key Interceptors

| Interceptor | Purpose |
|-------------|---------|
| `TenantScopeInterceptor` | Extracts tenantId from JWT, sets Prisma context |
| `CorrelationIdInterceptor` | Generates/propagates X-Correlation-ID header |
| `AuditInterceptor` | Logs mutations for audit trail |

### Key Guards

| Guard | Purpose |
|-------|---------|
| `AuthGuard('jwt')` | Validates JWT token |
| `RolesGuard` | Checks `@Roles()` decorator against user's role |
| `SuperAdminGuard` | Checks `isSuperAdmin` flag |
| `ThrottlerGuard` | Rate limiting per IP/user |

---

## 3. Frontend Architecture (Next.js 15)

### Three-App Structure

```
apps/web/src/app/
├── (storefront)/           # Public storefront (customer-facing)
│   ├── layout.tsx          # Storefront layout
│   ├── page.tsx            # Home page
│   ├── products/           # Product catalog
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   └── account/            # Customer account
├── (seller)/               # Seller ERP (merchant-facing)
│   ├── layout.tsx          # Seller layout
│   ├── page.tsx            # Dashboard
│   ├── products/           # Product management
│   ├── orders/             # Order management
│   ├── inventory/          # Stock management
│   ├── customers/          # Customer management
│   └── financial/          # Financial management
├── (admin)/                # Admin platform (super admin)
│   ├── layout.tsx          # Admin layout
│   ├── page.tsx            # Admin dashboard
│   ├── tenants/            # Tenant management
│   └── users/              # User management
└── api/
    └── auth/
        └── [...nextauth]   # NextAuth route handler
```

### State Management

| Scope | Solution | Usage |
|-------|----------|-------|
| Server data | React Query | API calls, caching, refetching |
| Global UI | Zustand | Theme, sidebar, modals |
| Cart | Zustand + persistence | Shopping cart (localStorage) |
| Forms | React Hook Form | Complex forms |
| Builder | Zustand | CPQ configuration state |

### Component Architecture

```
components/
├── ui/                     # shadcn/ui primitives (Button, Card, Input...)
├── layout/                 # Layout components (Header, Sidebar, Footer)
├── storefront/             # Storefront-specific components
├── seller/                 # Seller-specific components
├── admin/                  # Admin-specific components
└── builder/                # CPQ builder components
```

---

## 4. Database Design (PostgreSQL)

### Tenant Isolation Strategy

**Row-Level Security (RLS)**:
- Every tenant-scoped table has `tenantId` column
- RLS policies enforce `tenantId = current_setting('app.current_tenant')`
- Prisma middleware auto-injects `tenantId` on all queries
- `User` and `Tenant` are platform-scoped (no tenantId)

### Key Indexes

```sql
-- Multi-tenant query patterns
CREATE INDEX idx_products_tenant_type ON "Product" (tenantId, type, "isActive");
CREATE INDEX idx_orders_tenant_status ON "Order" (tenantId, status, "createdAt");
CREATE INDEX idx_cart_items_cart ON "CartItem" (cartId);

-- Unique constraints
CREATE UNIQUE INDEX idx_products_tenant_slug ON "Product" (tenantId, slug);
CREATE UNIQUE INDEX idx_tenant_slug ON "Tenant" (slug);
```

### JSONB Usage

| Table | JSONB Field | Content |
|-------|-------------|---------|
| `Product` | `metadata` | Flexible product attributes |
| `Product` | `cpqTemplate` | CPQ configuration template |
| `Order` | `shippingAddress` | Structured address |
| `CartItem` | `configurationData` | CPQ configuration snapshot |
| `Configuration` | `enclosure`, `circuits`, `components` | CPQ configuration data |
| `FinancialAccount` | `configuration` | Account settings |

---

## 5. Security Architecture

### Authentication Flow

```
1. User submits credentials
2. API validates against User table (argon2 password hash)
3. API returns { accessToken, refreshToken }
4. Client stores in HTTP-only cookie (NextAuth)
5. Subsequent requests include Authorization: Bearer <token>
6. API validates JWT, extracts userId + tenantId
7. Middleware sets tenant scope for all queries
```

### Authorization Model

```
Super Admin → Full access to all tenants
Tenant Admin → Full access to own tenant
Manager → Orders, inventory, customers
Operator → Orders and inventory only
Viewer → Read-only access
```

### Security Headers (helmet)

```
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 0
```

### Rate Limiting

```
Global: 20 requests per minute per IP
Auth: 5 requests per minute per IP
API: 100 requests per minute per user
```

---

## 6. CPQ Module Integration

### How CPQ Fits in the Marketplace

The CPQ builder is **one module** within the larger marketplace system. It integrates at specific touchpoints:

```
Storefront Product Page
├── Tab: "Descrição"
├── Tab: "Especificações"
└── Tab: "Monte seu Painel" → CPQ Builder
    ├── Configure panel specs
    ├── Select components
    ├── Review pricing
    └── Add to Cart ← Creates CartItem with configurationData

Shopping Cart
├── Standard items: name, qty, price
├── CPQ items: name, configuration snapshot, price
│   └── [Personalizar] → Reopens CPQ editor
└── [Checkout] → Creates Order

Order (in Seller ERP)
├── Standard items: direct fulfillment
└── CPQ items: triggers production workflow
    └── BOM generated from configuration
```

### CPQ Data Model

```
CPQProduct (Product with type=CPQ_CONFIGURABLE)
    └── cpqTemplate: {
        enclosureOptions: [...],
        componentCategories: [...],
        maxCircuits: number,
        maxComponents: number
    }

Configuration
    ├── enclosure: { type, width, height, depth, material, ipRating }
    ├── circuits: [{ id, name, type, voltage, color }]
    ├── placements: [{ componentId, railId, position, circuitId }]
    └── pricing: { components, labor, overhead, total }
```

---

## 7. API Design

### URL Structure

```
/api/v1/auth/*                    # Authentication
/api/v1/products/*                # Product catalog (public)
/api/v1/categories/*              # Categories (public)
/api/v1/cart/*                    # Shopping cart
/api/v1/orders/*                  # Orders
/api/v1/customers/*               # Customer accounts
/api/v1/cpq/*                     # CPQ configurations
/api/v1/seller/*                  # Seller ERP (seller-scoped)
/api/v1/admin/*                   # Admin platform
/api/v1/platform/plans/*          # Subscription plans
/api/v1/platform/billing/*        # Billing
/api/v1/privacy/*                 # LGPD compliance
```

### Response Format

**Success:**
```json
{
  "data": { ... },
  "meta": { "requestId": "uuid", "timestamp": "ISO8601" }
}
```

**Error:**
```json
{
  "statusCode": 400,
  "message": ["field1 is required"],
  "error": "Bad Request",
  "requestId": "uuid"
}
```

---

## 8. Infrastructure

### Development

| Service | Container | Port |
|---------|-----------|------|
| PostgreSQL | cpq-postgres | 5432 |
| Redis | cpq-redis | 6379 |
| API | cpq-api | 3000 |
| Web | cpq-web | 3001 |
| nginx | cpq-nginx | 80 |

### Production (VPS)

Same containers, plus:
- Prometheus (metrics)
- Grafana (dashboards)
- Loki (logs)
- Automated backups

---

## 9. Key Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Multi-tenant RLS** | All queries | Data isolation |
| **Repository** | Prisma Service | Data access abstraction |
| **DTO + Validation** | Controllers | Input safety |
| **JWT Rotation** | Auth | Security |
| **Optimistic Locking** | Versioned entities | Concurrency |
| **State Machine** | Order lifecycle | Predictable transitions |
| **Feature Flags** | Tenant config | Per-tenant capabilities |

---

## 10. Diagrams

- [C4 Context](diagrams/c4-context.puml) — System context
- [C4 Container](diagrams/c4-container.puml) — Container view
- [C4 Component](diagrams/c4-component.puml) — API components
- [ER Diagram](diagrams/er-diagram.puml) — Database entities

---

*Documento vivo — atualizado a cada ADR ou mudança arquitetural significativa.*
