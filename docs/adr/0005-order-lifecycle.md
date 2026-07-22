# ADR-0005: Order Lifecycle

**Status**: Accepted  
**Date**: 2026-07-22

## Context

Orders flow from customer checkout through seller fulfillment. The order lifecycle must track the entire journey from placement to delivery, integrating with the seller's ERP system.

## Decision

Use a state machine pattern with explicit status transitions. Orders are created from the checkout flow and progress through seller-defined stages.

### Order Model

```prisma
model Order {
  id              String      @id @default(cuid())
  tenantId        String
  orderNumber     String      @unique
  customerId      String
  status          OrderStatus @default(PENDING)
  
  // Pricing
  subtotal        Decimal     @db.Decimal(18, 4)
  taxAmount       Decimal     @default(0) @db.Decimal(18, 4)
  discountAmount  Decimal     @default(0) @db.Decimal(18, 4)
  totalAmount     Decimal     @db.Decimal(18, 4)
  currency        String      @default("BRL")
  
  // Shipping
  shippingAddress Json?
  shippingMethod  String?
  trackingCode    String?
  
  // Timestamps
  confirmedAt     DateTime?
  producedAt      DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  items           OrderItem[]
  shipments       Shipment[]
}

model OrderItem {
  id              String   @id @default(cuid())
  orderId         String
  productId       String
  productName     String   // Snapshot
  quantity        Int
  unitPrice       Decimal  @db.Decimal(18, 4)
  totalPrice      Decimal  @db.Decimal(18, 4)
  // CPQ-specific
  configurationId String?
  configurationData Json?
}

enum OrderStatus {
  PENDING       // Awaiting seller confirmation
  CONFIRMED     // Seller accepted, awaiting production
  IN_PRODUCTION // Being manufactured
  READY_TO_SHIP // Produced, awaiting shipment
  SHIPPED       // In transit
  DELIVERED     // Customer received
  CANCELLED     // Cancelled by customer or seller
  REFUNDED      // Refunded after cancellation
}
```

### State Machine

```
PENDING → CONFIRMED → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → DELIVERED
   ↓           ↓             ↓              ↓
CANCELLED   CANCELLED    CANCELLED      REFUNDED
```

### Transitions

| From | To | Trigger |
|------|----|---------|
| PENDING | CONFIRMED | Seller confirms order |
| CONFIRMED | IN_PRODUCTION | Seller starts production |
| IN_PRODUCTION | READY_TO_SHIP | Production complete |
| READY_TO_SHIP | SHIPPED | Shipment dispatched |
| SHIPPED | DELIVERED | Customer confirms receipt |
| * | CANCELLED | Customer or seller cancels |
| SHIPPED/DELIVERED | REFUNDED | Refund processed |

### ERP Integration

When an order is created:
1. Order appears in seller's ERP dashboard
2. Inventory is reserved (or backordered)
3. Production order created (for CPQ items)
4. Customer receives order confirmation

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/orders` | List orders (customer/seller/admin scopes) |
| GET | `/orders/:id` | Order detail |
| POST | `/orders/:id/confirm` | Seller confirms |
| POST | `/orders/:id/advance` | Advance status |
| POST | `/orders/:id/cancel` | Cancel order |

## Consequences

### Positive
- Clear order lifecycle with audit trail
- Seller has full control over fulfillment
- CPQ configurations preserved in order items
- Extensible for complex workflows

### Negative
- State machine adds complexity
- Inventory reservation needs careful handling
- Cancellation/refund logic is complex
