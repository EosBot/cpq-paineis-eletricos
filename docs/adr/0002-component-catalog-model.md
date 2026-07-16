# ADR 0002 - Component catalog model

## Status
Accepted

## Context
The CPQ catalog must support multiple manufacturers, heterogeneous electrical components, validation needs, and future rule-based compatibility. The model needed flexibility without losing a canonical domain shape.

## Decision
- Use `Component` as the tenant-owned catalog entity.
- Use `ComponentCategory` as the attribute template definition.
- Use typed `ComponentAttribute` values to materialize the category template on each component.
- Categories define which attributes are required for components of that kind.

## Consequences
### Positive
- Supports heterogeneous component kinds without a migration per category.
- Keeps a canonical vocabulary for catalog structure.
- Allows validation against category templates.

### Negative
- Querying and indexing attribute-heavy searches is more complex than fixed tables.
- Attribute governance becomes part of category design discipline.

## Alternatives considered
- Fixed sibling tables per category
- Free-form JSON specs
- Generic component with ungoverned key-value attributes
