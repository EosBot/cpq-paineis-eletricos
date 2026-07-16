# ADR 0005 - BOM versioning and order handoff

## Status
Accepted

## Context
The contract requires BOM generation and future downstream operational flow after quote approval. We needed to define whether BOM is mutable, how it is versioned, and what happens after quote approval.

## Decision
- BOM has its own immutable versioning.
- Each recalculation generates a new `BOMVersion` linked to the corresponding `QuoteVersion` and configuration snapshot.
- A `CustomerApproved` quote creates an `Order` inside the same system.
- The initial order lifecycle is `Confirmed` → `InProduction` → `ReadyToShip` → `Shipped` → `Delivered`.

## Consequences
### Positive
- Preserves traceability between technical definition, commercial proposal, and operational handoff.
- Gives the product a clear boundary beyond quote approval.

### Negative
- Introduces a new operational aggregate earlier in the product journey.
- Downstream logistics, production, and ERP boundaries still need dedicated modeling.

## Alternatives considered
- BOM as a non-versioned derived view only
- BOM editable without versioning
- End the system boundary at approved quote with no internal order aggregate
