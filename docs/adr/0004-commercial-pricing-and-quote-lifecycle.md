# ADR 0004 - Commercial pricing and quote lifecycle

## Status
Accepted

## Context
The system must price quotes for B2B customers of each manufacturer. We needed a precise model for customer ownership, contract-driven pricing, quote lifecycle, versioning, taxes, and reopening behavior.

## Decision
- Customer ownership is B2B account-based.
- `CustomerAccount` is the customer company.
- `CustomerContact` is a person linked to the customer account.
- `Quote` belongs to a customer account and may reference one primary contact.
- Pricing is driven by an optional `CommercialContract` between tenant and customer account.
- When no commercial contract exists, tenant default pricing applies.
- A commercial contract may restrict which catalog components are commercially available to a customer account.
- A commercial contract does not create new components and does not override tenant technical rules.
- Currency is single per tenant in the initial scope.
- Taxes are declarative pricing components resolved from the commercial contract or tenant default pricing.
- The quote lifecycle is `Draft` → `InternalReview` → `Calculated` → `Sent` → `CustomerApproved` or `Rejected` or `Expired`.
- `InternalReview` is the internal approval stage.
- `CustomerApproved` is the customer acceptance stage.
- Reopening an expired quote is allowed only through administrative action and creates a new `QuoteVersion` with recalculation against the current configuration or a chosen snapshot.
- `Engineer` edits configuration and submits it to internal review.
- `Sales` calculates and sends quotes.
- `Admin` approves exceptions and reopens expired quotes.

## Consequences
### Positive
- Aligns the model with B2B selling reality.
- Preserves commercial traceability through quote versions.
- Makes pricing behavior explicit when customer-specific contracts are absent.

### Negative
- Requires explicit governance for contract validity and pricing fallback behavior.
- Single currency per tenant limits early multi-currency use cases.

## Alternatives considered
- Manual pricing only
- Mandatory commercial contract for every quote
- Customer model without account/contact separation
