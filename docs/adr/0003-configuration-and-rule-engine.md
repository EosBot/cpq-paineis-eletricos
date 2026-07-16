# ADR 0003 - Configuration and rule engine

## Status
Accepted

## Context
The contract requires support for configuration, validation, pricing, BOM generation, compatibility, electrical rules, automatic sizing, and future React Flow compatibility. We needed to define how rules are represented and how configuration evolves through the quote lifecycle.

## Decision
- `Configuration` is the editable technical aggregate while the quote is in `Draft`.
- Leaving `Draft` and entering `InternalReview` creates an immutable `ConfigurationSnapshot`.
- The rule engine is declarative.
- `Rule` is tenant-owned and versioned.
- `Engineer` proposes rule changes.
- `Admin` approves and publishes rule versions.
- `QuoteVersion` always references the exact rule versions used during calculation.

## Consequences
### Positive
- Supports auditability and reproducible quote calculations.
- Avoids coupling React Flow directly to the domain while preserving future compatibility.
- Creates a controlled governance path for business-critical rule publication.

### Negative
- Declarative rules and immutable snapshots increase model complexity.
- Rule authoring and approval workflows must be designed carefully.

## Alternatives considered
- Hardcoded rules in services
- Immediate rule publication without approval
- Configuration represented only as a live mutable structure without snapshots
