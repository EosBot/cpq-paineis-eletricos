# ADR-0003: Product Catalog

**Status**: Accepted  
**Date**: 2026-07-22

## Context

Sellers on the marketplace need to sell both standard products (off-the-shelf items) and configurable products (panels built via CPQ). The catalog must support both types seamlessly.

## Decision

Use a unified `Product` model with a `type` discriminator. Standard products have fixed pricing. CPQ-configurable products reference the CPQ component catalog and have dynamic pricing based on configuration.

### Product Model

```prisma
model Product {
  id          String       @id @default(cuid())
  tenantId    String
  name        String
  slug        String       @unique
  description String?
  type        ProductType  @default(STANDARD)
  price       Decimal?     @db.Decimal(18, 4)  // Fixed price for STANDARD
  categoryId  String?
  images      ProductImage[]
  isActive    Boolean      @default(true)
  metadata    Json?        // Flexible attributes
  
  // CPQ-specific (when type == CPQ_CONFIGURABLE)
  cpqTemplate Json?        // Template configuration for CPQ builder
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  @@unique([tenantId, slug])
  @@index([tenantId, type, isActive])
}

enum ProductType {
  STANDARD           // Fixed price, no configuration
  CPQ_CONFIGURABLE   // Price determined by CPQ configuration
}
```

### Product Types

| Type | Description | Pricing | Example |
|------|-------------|---------|---------|
| `STANDARD` | Fixed product | Fixed price in `price` field | Circuit breaker, cable, enclosure |
| `CPQ_CONFIGURABLE` | Configurable via CPQ builder | Dynamic based on configuration | Custom electrical panel |

### Category System

Products are organized into tenant-specific categories:

```prisma
model Category {
  id       String    @id @default(cuid())
  tenantId String
  name     String
  slug     String
  parentId String?   // Hierarchical categories
  products Product[]
  
  @@unique([tenantId, slug])
}
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | List products (with filters, pagination) |
| GET | `/products/:slug` | Product detail |
| POST | `/products` | Create product (seller only) |
| PATCH | `/products/:id` | Update product (seller only) |
| DELETE | `/products/:id` | Delete product (seller only) |
| GET | `/categories` | List categories |
| POST | `/categories` | Create category (seller only) |

## Consequences

### Positive
- Unified catalog for all product types
- Easy to add new product types in future
- CPQ products are first-class catalog citizens
- Flexible metadata via JSONB

### Negative
- CPQ pricing requires separate calculation endpoint
- Product detail page must handle different types differently
- JSONB metadata is not strongly typed

## References

- `apps/api/src/modules/marketplace/product.service.ts` — Product CRUD
- `apps/api/src/modules/marketplace/dto/create-product.dto.ts` — Product DTO
- ADR-0002: Storefront (product display)
- ADR-0007: CPQ Module (configurable products)
