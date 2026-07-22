# ADR-0009: Concurrency & Consistency

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The marketplace handles concurrent operations from multiple sellers and customers. Order processing, inventory management, and pricing calculations must be consistent and race-condition free.

## Decision

Use a combination of optimistic locking for most operations and pessimistic locking for critical state transitions.

### Strategies

| Strategy | Use Case | Implementation |
|----------|----------|----------------|
| **Optimistic Locking** | Versioned resources (snapshots, versions) | `version` field with `UPDATE ... WHERE version = X` |
| **Pessimistic Locking** | State transitions (order advance, approval) | `SELECT FOR UPDATE` in transaction |
| **Idempotency Keys** | POST operations (create order, configuration) | `Idempotency-Key` header with 24h TTL |
| **Atomic Counters** | Inventory, stock levels | `UPDATE quantity = quantity - X WHERE quantity >= X` |

### Order State Transitions

Order status changes use pessimistic locking to prevent concurrent modifications:

```typescript
await this.prisma.$transaction(async (tx) => {
  const order = await tx.order.findFirst({
    where: { id, tenantId, status: currentStatus },
    select: { id: true, version: true },
  });
  
  if (!order) throw new ConflictException('Order status changed');
  
  return tx.order.update({
    where: { id, version: order.version },
    data: { status: nextStatus, version: { increment: 1 } },
  });
}, { isolationLevel: 'Serializable' });
```

### Inventory Management

Stock decrements use atomic operations to prevent overselling:

```typescript
const result = await this.prisma.$executeRaw`
  UPDATE "InventoryItem"
  SET quantity = quantity - ${quantity},
      "updatedAt" = NOW()
  WHERE id = ${inventoryId}
    AND quantity >= ${quantity}
`;
if (result === 0) throw new ConflictException('Insufficient stock');
```

### Cache Strategy

| Data | Cache | TTL | Invalidation |
|------|-------|-----|--------------|
| Product catalog | Redis | 5 min | On product update |
| Category tree | Redis | 15 min | On category change |
| Pricing rules | Redis | 10 min | On rule approval |
| User session | Cookie | Session | On logout |
| Order status | None | — | Real-time |

## Consequences

### Positive
- Prevents overselling and race conditions
- Optimistic locking is performant for read-heavy workloads
- Pessimistic locking ensures correctness for critical operations
- Idempotency prevents duplicate charges/orders

### Negative
- Serializable isolation can cause transaction retries
- Optimistic locking requires retry logic on conflicts
- Cache invalidation adds complexity
- Deadlocks possible if lock ordering is inconsistent
