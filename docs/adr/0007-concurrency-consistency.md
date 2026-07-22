# ADR 0007 – Concurrency & Consistency Strategy

## Status
Accepted

## Context
The CPQ system handles high-value, multi-tenant transactions where correctness is critical. The domain includes quote calculation, configuration approval, BOM generation, order creation, and shipment. These processes involve mutable state that can be accessed concurrently by multiple requests, potentially from the same tenant or different tenants.

Key challenges:
- Preventing race conditions that could lead to lost updates or inconsistent state.
- Ensuring idempotent handling of client retries (network failures).
- Maintaining appropriate isolation levels to avoid dirty reads, phantom reads, and write skew.
- Designing for future scalability and potential saga patterns for long-running workflows.

## Decision
We adopt the following strategy:

### 1. Optimistic Locking
- Add a `version` field (integer) to all mutable aggregate roots that are subject to concurrent updates:
  - `quote_versions.versionNumber`
  - `configuration_snapshots.versionNumber`
  - `rule_versions.versionNumber`
  - `bom_versions.versionNumber`
- Use Prisma's `@@version` attribute or manual version column.
- In update queries, include `where version = $oldVersion` to ensure only the current version can be updated.
- If version mismatch occurs, throw `ConcurrentUpdateError` and retry (client must handle).

### 2. Idempotency
- All `POST` endpoints that create or modify state must accept an optional `Idempotency-Key` header.
- Generate a unique key on the client (e.g., UUID) and reuse it for retries.
- Store the key and associated operation in a lightweight store (e.g., Redis or DB) to detect duplicates.
- Endpoints that are idempotent by nature (e.g., `POST /quotes/{id}/calculate`) may skip duplicate processing if key matches a successful prior operation.

### 3. Isolation Levels
- Default isolation level remains `READ COMMITTED` (PostgreSQL default).
- For critical sections where race conditions are detected (e.g., `advanceOrder`, `approveRuleVersion`, `calculateQuoteVersion`), use explicit `SELECT FOR UPDATE` within transactions to enforce serializability.
- Document that changing isolation level globally is avoided to prevent performance impact; instead, apply row-level locking where needed.

### 4. Saga Pattern (Future)
- Current workflows are implemented as atomic transactions. For future long-running processes (e.g., multi-step integrations with external ERP), we will adopt the Saga pattern with compensating transactions.
- Design event-driven architecture to emit domain events that can trigger saga steps.

### 5. Testing
- Add unit and integration tests that simulate concurrent access (e.g., using `Promise.all` with shared resources) to verify locking and idempotency behavior.
- Use Playwright to simulate multiple concurrent users in staging.

## Consequences
- Increased complexity in update logic and error handling.
- Need to manage version fields and idempotency storage.
- Potential performance impact on high-concurrency paths due to row locking.
- Future architectural changes may be required for large-scale saga orchestration.

## Alternatives Considered
- **Pessimistic locking**: Use `SELECT FOR UPDATE` on all mutable reads. This guarantees consistency but can lead to deadlocks and reduced throughput.
- **Serializable isolation**: Set database isolation to `SERIALIZABLE`. This eliminates many anomalies but significantly reduces performance under load.
- **No locking**: Rely solely on optimistic concurrency without version checks. This risks data anomalies under high concurrency.

These alternatives were rejected due to performance, correctness, or complexity trade-offs.

## Future Work
- Implement idempotency key storage with TTL.
- Add metrics for concurrent update rate and retry counts.
- Review and possibly extend locking strategy as load increases.

## References
- Prisma Transaction Handling
- PostgreSQL Isolation Levels
- OWASP Idempotency Best Practices
- Martin Fowler – Saga Pattern