# ADR 0006 - First vertical API surface

## Status
Accepted

## Context
The first vertical slice needs a stable API surface. The implementation introduced authentication, catalog, rules, configurations, pricing, and quotes, and was later extended with BOM generation, order handoff, and shipment/shipping-quote management. We freeze the `/api/v1` contract shape for this slice, including the downstream operational flow.

## Decision
The vertical API surface is organized into the following route groups:

### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/validate`

### Catalog
- `POST /api/v1/catalog/component-categories`
- `GET /api/v1/catalog/component-categories`
- `POST /api/v1/catalog/components`
- `GET /api/v1/catalog/components`

### Rules
- `POST /api/v1/rules`
- `POST /api/v1/rules/versions`
- `POST /api/v1/rules/versions/approve`
- `GET /api/v1/rules`

### Configurations
- `POST /api/v1/configurations`
- `GET /api/v1/configurations`
- `POST /api/v1/configurations/submit-for-review`

### Pricing
- `GET /api/v1/pricing/quotes/:quoteId/context`

### Quotes
- `POST /api/v1/quotes`
- `GET /api/v1/quotes`
- `POST /api/v1/quotes/:quoteId/calculate`
- `POST /api/v1/quotes/send`
- `POST /api/v1/quotes/customer-approve`
- `POST /api/v1/quotes/reopen`

### BOM
- `POST /api/v1/bom/versions`
- `GET /api/v1/bom/versions?quoteId=`

### Orders
- `POST /api/v1/orders/convert`
- `POST /api/v1/orders/:orderId/advance`
- `GET /api/v1/orders`
- `GET /api/v1/orders/:orderId`

### Shipments
- `POST /api/v1/shipments`
- `POST /api/v1/shipments/:shipmentId/shipping-quotes`
- `POST /api/v1/shipments/shipping-quotes/select`
- `POST /api/v1/shipments/:shipmentId/advance`
- `GET /api/v1/shipments`
- `GET /api/v1/shipments/:shipmentId`

The vertical requires tenant-scoped request context through headers and JWT-authenticated identity.

## Consequences
### Positive
- Freezes the first useful API boundary for the product.
- Aligns implementation with the agreed vertical flow.
- Keeps later BOM/order/shipping expansion outside the current contract.

### Negative
- Header-based tenant context is an interim API boundary and may later move into a richer request context abstraction.
- The API still lacks Swagger wiring and integration tests.

## Alternatives considered
- Delay API definition until all downstream modules existed
- Design BOM/order/shipping routes before the first quote vertical was stable
