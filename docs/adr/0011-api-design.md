# ADR-0011: API Design (REST)

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The marketplace API serves three distinct clients: Storefront (customer), Seller ERP (merchant), and Admin (platform). A consistent, well-designed API is critical for developer experience and maintainability.

## Decision

Use RESTful API design with OpenAPI 3.1 specification. URL versioning via prefix (`/api/v1/`). Consistent response envelopes and error formats.

### URL Structure

```
/api/v1/auth/*              # Authentication (login, refresh, logout)
/api/v1/products/*          # Product catalog (public + seller-scoped)
/api/v1/categories/*        # Product categories
/api/v1/cart/*              # Shopping cart
/api/v1/orders/*            # Orders (customer + seller + admin scopes)
/api/v1/customers/*         # Customer accounts
/api/v1/seller/*            # Seller ERP endpoints
/api/v1/admin/*             # Admin platform endpoints
/api/v1/cpq/*               # CPQ module endpoints
```

### Response Envelopes

**Success (single resource)**:
```json
{
  "data": { ... },
  "meta": { "requestId": "uuid", "timestamp": "ISO8601" }
}
```

**Success (collection)**:
```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**Error**:
```json
{
  "statusCode": 400,
  "message": ["field1 is required", "field2 must be email"],
  "error": "Bad Request",
  "requestId": "uuid"
}
```

### HTTP Methods

| Method | Usage | Idempotent |
|--------|-------|-----------|
| GET | Read resources | Yes |
| POST | Create resources | No (use Idempotency-Key) |
| PATCH | Partial update | Yes |
| PUT | Full replace | Yes |
| DELETE | Remove resource | Yes |

### Pagination

**Cursor-based** (default for infinite scroll):
```
GET /api/v1/products?cursor=eyJpZCI6MTIzfQ==&limit=20
```

**Offset-based** (for admin/reports):
```
GET /api/v1/orders?page=2&limit=50&sort=createdAt:desc
```

### Filtering

```
GET /api/v1/products?category=breakers&minPrice=100&maxPrice=500&inStock=true
```

### Sorting

```
GET /api/v1/orders?sort=createdAt:desc,totalAmount:asc
```

### Field Selection (future)

```
GET /api/v1/products?fields=id,name,price,imageUrl
```

### Versioning

- URL prefix: `/api/v1/`
- Breaking changes → `/api/v2/`
- Deprecated endpoints return `Deprecation` header
- Minimum 6 months support for old versions

### Headers

| Header | Usage |
|--------|-------|
| `Authorization` | Bearer JWT |
| `X-Tenant-ID` | Tenant context (derived from JWT) |
| `X-Correlation-ID` | Request tracing |
| `X-Idempotency-Key` | Idempotent POST |
| `Accept-Language` | i18n (pt-BR, en) |

### OpenAPI

- Generated via `@nestjs/swagger`
- Available at `/api/docs` (Swagger UI)
- Schema exported to `openapi.yaml`
- Used for client SDK generation (future)

## Consequences

### Positive
- Consistent API across all modules
- OpenAPI enables SDK generation
- Cursor pagination scales for large datasets
- Clear error format aids debugging

### Negative
- Response envelopes add overhead
- Multiple pagination strategies add complexity
- Versioning requires discipline to maintain
- Field selection not yet implemented
