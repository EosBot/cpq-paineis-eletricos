# ADR-0004: Cart & Checkout

**Status**: Accepted  
**Date**: 2026-07-22

## Context

Customers need a shopping cart to collect items before purchase. The cart must handle both standard products and CPQ-configurable products. Checkout must create an order that flows to the seller's ERP.

## Decision

Implement a cart system with session-based persistence (for guests) and customer-linked persistence (for authenticated users). Checkout is mocked (no real payment gateway) but produces a complete order record.

### Cart Model

```prisma
model Cart {
  id         String     @id @default(cuid())
  customerId String?    // Authenticated customer
  sessionId  String?    @unique  // Guest session
  status     CartStatus @default(ACTIVE)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  items      CartItem[]
}

model CartItem {
  id              String   @id @default(cuid())
  cartId          String
  productId       String
  quantity        Int      @default(1)
  unitPrice       Decimal  @db.Decimal(18, 4)  // Snapshot price
  // CPQ-specific fields
  configurationId String?  // Reference to saved CPQ configuration
  configurationData Json?  // Embedded configuration snapshot
  
  @@index([cartId])
}

enum CartStatus {
  ACTIVE
  CHECKOUT
  COMPLETED
  ABANDONED
}
```

### Cart Behavior

1. **Guest cart**: Session ID stored in cookie, cart persists for 7 days
2. **Authenticated cart**: Linked to customer account, persists indefinitely
3. **Cart merge**: On login, guest cart merges with customer cart
4. **Price snapshot**: Unit price captured at add-to-cart time
5. **CPQ items**: Configuration data embedded in cart item for portability

### Checkout Flow

```
Cart → Review → Address → Payment (mock) → Order Created
                                            ↓
                                    Seller ERP notified
                                            ↓
                                    Order status: PENDING
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cart` | Get current cart |
| POST | `/cart/items` | Add item to cart |
| PATCH | `/cart/items/:id` | Update quantity |
| DELETE | `/cart/items/:id` | Remove item |
| POST | `/checkout` | Create order from cart |

## Consequences

### Positive
- Guests can shop without account
- CPQ configurations are preserved in cart
- Price snapshot protects against price changes
- Easy to add real payment gateway later

### Negative
- Guest carts can be lost (session expiry)
- No real payment processing yet
- Cart merge logic can have edge cases
