# Context

## Ubiquitous Language

### Platform Level

| Term | Definition |
|------|-----------|
| **Platform** | The marketplace system itself. Manages tenants, infrastructure, and governance. |
| **Super Admin** | Platform operator. Manages tenants, users, billing, and global settings. Has access to all tenant data. |
| **Tenant** | A seller/merchant on the platform. Has an isolated storefront, ERP data, and staff users. |
| **Tenant Status** | ACTIVE, SUSPENDED, TRIAL, CANCELED. Determines if the tenant can operate. |
| **Subscription** | The tenant's plan (Free, Pro, Enterprise). Defines limits and available features. |
| **Feature Flag** | Per-tenant configuration to enable/disable modules (e.g., CPQ). |

### User & Auth Level

| Term | Definition |
|------|-----------|
| **User** | A person authenticated by the platform. Can belong to one or more tenants via memberships. |
| **Membership** | Links a user to a tenant with a specific role. A user can have multiple memberships (different tenants). |
| **Role** | A tenant-scoped permission profile (admin, manager, operator, viewer). |
| **Customer** | A buyer on the marketplace. May or may not be a registered user. Belongs to a tenant (the seller). |
| **Session** | Authenticated state for frontend (NextAuth JWT cookie). |

### Storefront Level

| Term | Definition |
|------|-----------|
| **Storefront** | The public-facing store of a tenant. Products, cart, checkout, customer account. |
| **Product** | An item for sale. Can be STANDARD (fixed price) or CPQ_CONFIGURABLE (configured by customer). |
| **Category** | Hierarchical organization of products within a tenant. |
| **Product Image** | Visual representation of a product. Stored in object storage. |
| **Catalog** | The complete set of products and categories visible to customers. |
| **Pricing** | The price of a product. Fixed for STANDARD, dynamically calculated for CPQ_CONFIGURABLE. |

### Cart & Checkout Level

| Term | Definition |
|------|-----------|
| **Cart** | A customer's shopping session. Contains items to be purchased. |
| **Cart Item** | A product added to cart with quantity and optional CPQ configuration. |
| **Session Cart** | A cart linked to a browser session (for guest users). |
| **Customer Cart** | A cart linked to a registered customer account. |
| **Cart Merge** | When a guest logs in, their session cart merges with their customer cart. |
| **Checkout** | The process of converting a cart into an order. Includes address, shipping, payment. |
| **Order** | A confirmed purchase. Contains items, pricing, status, and fulfillment information. |

### Order & Fulfillment Level

| Term | Definition |
|------|-----------|
| **Order Status** | PENDING → CONFIRMED → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → DELIVERED. Can also be CANCELLED or REFUNDED. |
| **Order Item** | A line item within an order. Snapshot of product at time of purchase. |
| **Shipment** | Physical delivery of an order or part of an order. |
| **Tracking Code** | Carrier tracking identifier for a shipment. |
| **Fulfillment** | The complete process from order confirmation to delivery. |

### CPQ Module Level

| Term | Definition |
|------|-----------|
| **CPQ** | Configure-Price-Quote. The module that allows customers to configure complex products. |
| **CPQ Product** | A product with `type=CPQ_CONFIGURABLE`. Price determined by configuration. |
| **Configuration** | A customer's specific setup of a CPQ product (enclosure, circuits, components, layout). |
| **Configuration Status** | DRAFT → CONFIGURED → IN_CART → ORDERED → IN_PRODUCTION. |
| **CPQ Template** | Defines the configurable options for a CPQ product (available enclosures, component categories). |
| **DINRail** | Standard mounting rail for electrical components within a panel. |
| **Component** | An electrical component that can be placed in a panel (breaker, contactor, relay, etc.). |
| **Component Category** | Grouping of components by type or function. |
| **Component Placement** | Position of a component on a DIN rail within the panel layout. |
| **Circuit** | An electrical circuit within the panel. Groups components electrically. |
| **Panel Enclosure** | The physical cabinet/housing that contains the electrical components. |
| **BOM** | Bill of Materials. The complete list of components and quantities needed for a configuration. |
| **Labor Hours** | Estimated production time for assembling a configured panel. |

### ERP Level (Seller Operations)

| Term | Definition |
|------|-----------|
| **Seller** | A tenant who sells products on the platform. Has access to ERP panel. |
| **Seller ERP** | The seller's management panel for products, orders, inventory, customers, financial. |
| **Inventory** | Stock levels of products across locations. |
| **Stock Movement** | Record of inventory change (inbound, outbound, adjustment, transfer). |
| **Location** | A physical or logical place where inventory is stored (warehouse, shelf). |
| **Purchase Order** | Order placed by seller to a supplier for restocking. |
| **Sales Order** | Order received from a customer via the marketplace. |
| **Financial Account** | Chart of accounts for financial tracking. |
| **Financial Transaction** | A monetary entry (revenue, expense, transfer). |
| **Fiscal Document** | Brazilian tax document (NF-e, NFC-e, NFS-e). |
| **Tax Rate** | Applicable tax percentage for a product or transaction type. |

### Billing Level

| Term | Definition |
|------|-----------|
| **Plan** | Subscription tier (Free, Pro, Enterprise) with defined limits and features. |
| **Subscription** | A tenant's active plan subscription. |
| **Billing Period** | Monthly or annual billing cycle. |
| **Invoice** | A bill issued to a tenant for their subscription. |
| **Payment** | The settlement of an invoice. |
| **Usage** | Consumption-based metrics (products count, orders count, storage used). |

### Lifecycle Statuses

#### Order Status
The canonical order lifecycle is: `PENDING` → `CONFIRMED` → `IN_PRODUCTION` → `READY_TO_SHIP` → `SHIPPED` → `DELIVERED`.

An order can be `CANCELLED` from any non-terminal state, and `REFUNLED` after delivery.

#### Cart Status
`ACTIVE` → `CHECKOUT` → `COMPLETED` | `ABANDONED`

#### Configuration Status
`DRAFT` → `CONFIGURED` → `IN_CART` → `ORDERED` → `IN_PRODUCTION`

#### Tenant Status
`TRIAL` → `ACTIVE` | `SUSPENDED` | `CANCELED`

## Domain Rules

- The platform starts with row-level tenant isolation using `tenantId`.
- The model must preserve a future path to stronger isolation such as schema-per-tenant or database-per-tenant.
- A `User` belongs to one or more `Tenant`s via `Membership`.
- A `Customer` is always scoped to a specific `Tenant` (the seller).
- A `Product` can be `STANDARD` (fixed price) or `CPQ_CONFIGURABLE` (price from configuration).
- `Configuration` is mutable only while in `DRAFT` or `CONFIGURED` status.
- Adding to cart creates a snapshot of the product price at that moment.
- Checkout converts cart to order atomically.
- Orders are fulfilled by the seller, not the platform.
- The CPQ module can be enabled/disabled per tenant via feature flag.
- A tenant's storefront is publicly accessible at their custom domain.
- The seller ERP is accessible only to authenticated staff with appropriate roles.

## Module Boundaries

### API Modules (Backend)

| Module | Responsibility |
|--------|---------------|
| `auth` | Authentication, JWT, sessions, roles |
| `marketplace` | Products, categories, catalog |
| `cart` | Shopping cart management |
| `orders` | Order lifecycle, fulfillment |
| `cpq` | CPQ configurations, components, pricing |
| `seller` | Seller ERP endpoints |
| `admin` | Platform administration |
| `billing` | Subscriptions, plans, invoices |
| `erp` | Fiscal, financial, inventory, procurement |
| `privacy` | LGPD compliance |

### Frontend Apps

| App | Audience | Routes |
|-----|----------|--------|
| Storefront | Public customers | `/`, `/products/*`, `/cart`, `/checkout`, `/account/*` |
| Seller ERP | Seller staff | `/seller/*` |
| Admin | Super admins | `/admin/*` |

## Technology Constraints

- Single PostgreSQL database with row-level tenant isolation.
- Redis for caching, session storage, and rate limiting.
- Docker for containerization.
- No event bus in development (in-memory). Kafka in production.
- File storage local in development. S3-compatible in production.
