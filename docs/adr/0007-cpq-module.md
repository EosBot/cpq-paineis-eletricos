# ADR-0007: CPQ Module Within Marketplace

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The CPQ (Configure-Price-Quote) builder is a specialized module for configuring electrical panels. It is NOT the core product of the platform — it is a feature that sellers can offer to their customers within the marketplace.

## Decision

Integrate the existing CPQ builder as a module within the marketplace cart/product flow. Customers access CPQ functionality from:
1. **Product page tab**: "Monte seu Painel" tab on CPQ-configurable products
2. **Cart item action**: "Personalizer" button for CPQ items already in cart

### Integration Points

#### In the Product Page

```
Product Detail Page
├── Tab: Descrição (default)
├── Tab: Especificações
├── Tab: Monte seu Painel ← CPQ Builder
│   └── CPQBuilder component (embedded)
│       ├── Step 1: Project specs
│       ├── Step 2: Enclosure selection
│       ├── Step 3: Circuits definition
│       ├── Step 4: Components placement (DIN rail)
│       └── Step 5: Review + Pricing + Add to Cart
└── Tab: Reviews
```

#### In the Cart

```
Cart Item
├── Product name + image
├── Quantity selector
├── Unit price
├── [Personalizar] button → Opens CPQ editor pre-filled
└── Remove button
```

### Data Flow

```
Product Page → CPQ Builder → Configuration Saved
                                    ↓
                              Add to Cart (as CPQ line item)
                                    ↓
                              Cart → Checkout → Order
                                    ↓
                              Seller ERP (production order)
```

### CPQ Product Type

Products with `type=CPQ_CONFIGURABLE` have:
- No fixed price (price determined by configuration)
- Reference to CPQ template (enclosure options, component categories)
- Configuration stored as JSON snapshot

### Configuration Model

```prisma
model CpqConfiguration {
  id              String   @id @default(cuid())
  tenantId        String
  customerId      String?
  productId       String?  // Optional: linked to marketplace product
  name            String
  status          CpqStatus @default(DRAFT)
  
  // Configuration data
  enclosure       Json?
  circuits        Json?
  components      Json?
  pricing         Json?
  
  // Pricing result
  componentCost   Decimal? @db.Decimal(18, 4)
  laborCost       Decimal? @db.Decimal(18, 4)
  totalPrice      Decimal? @db.Decimal(18, 4)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum CpqStatus {
  DRAFT
  CONFIGURED
  IN_CART
  ORDERED
  IN_PRODUCTION
}
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cpq/configurations` | List customer configurations |
| POST | `/cpq/configurations` | Create new configuration |
| GET | `/cpq/configurations/:id` | Get configuration detail |
| PATCH | `/cpq/configurations/:id` | Update configuration |
| POST | `/cpq/configurations/:id/pricing` | Calculate pricing |
| POST | `/cpq/configurations/:id/add-to-cart` | Add to marketplace cart |

## Consequences

### Positive
- CPQ is a feature, not the core product
- Sellers can enable/disable CPQ per product
- Configurations are portable (product → cart → order)
- Reuses existing CPQ infrastructure

### Negative
- CPQ builder must work in embedded mode
- State management across product/cart/order is complex
- Pricing calculation must be real-time
- Two product types to manage in cart/checkout
