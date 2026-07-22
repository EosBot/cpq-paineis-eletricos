# Marketplace Architecture Patterns

Research on marketplace architectures for the CPQ platform, based on industry references.

## 1. Marketplace Models

### 1.1 Multi-Vendor Marketplace (our model)
Multiple sellers offer products to customers through a unified platform.

**Examples**: Shopify (multi-store), VTEX, Nuvemshop, Tray, Amazon Marketplace, Mercado Livre

**Characteristics**:
- Platform operator manages infrastructure, billing, and governance
- Sellers focus on their products and operations
- Customers get unified experience across sellers
- Revenue model: subscription + transaction fees

### 1.2 Inventory-Less Marketplace (dropshipping)
Platform connects sellers with customers but doesn't hold inventory.

### 1.3 Service Marketplace
Services rather than products (Uber, Freelancer.com).

**Our model**: Multi-Vendor Marketplace with physical products + configurable products (CPQ).

---

## 2. Storefront Architecture

### 2.1 Monorepo Multi-App (our approach)
Single codebase, multiple frontend apps sharing components and backend API.

```
apps/
  web/              # Storefront + Seller ERP + Admin (monorepo)
    storefront/     # Customer-facing
    seller/         # Seller ERP
    admin/          # Platform admin
packages/
  ui/               # Shared component library
  shared/           # Shared utilities
```

**Pros**: Code reuse, consistent UX, single deployment pipeline
**Cons**: Coupled deployments, larger build

### 2.2 Micro-Frontends
Each app is independently deployable, loaded via module federation.

**Pros**: Independent teams, technology flexibility
**Cons**: Complexity, version conflicts, performance overhead

**Decision**: Monorepo multi-app for MVP, micro-frontends if scale demands it.

---

## 3. Multi-Tenancy Patterns

### 3.1 Row-Level Isolation (our approach)
All tenants share the same database, isolated by `tenantId` column.

```sql
-- RLS Policy
CREATE POLICY tenant_isolation ON products
  USING (tenant_id = current_setting('app.current_tenant')::text);
```

**Pros**: Cost-effective, simple backup, easy cross-tenant analytics
**Cons**: Risk of data leakage, noisy neighbor

### 3.2 Schema-Per-Tenant
Each tenant has its own database schema.

**Pros**: Stronger isolation, easier per-tenant customization
**Cons**: Migration complexity, connection pooling challenges

### 3.3 Database-Per-Tenant
Each tenant has its own database instance.

**Pros**: Maximum isolation, independent scaling
**Cons**: Costly, complex management

**Decision**: Row-Level Isolation for MVP → Schema-per-tenant when required.

---

## 4. Seller Onboarding Flow

### 4.1 Self-Service (our choice)
```
Visitor → Register → Choose Plan → Setup Store → Add Products → Start Selling
```

**Steps**:
1. Email registration (email + password)
2. Select subscription plan (Free trial → Paid)
3. Configure store (name, domain, branding)
4. Add products (standard or CPQ configurable)
5. Configure shipping, taxes, payment (future)
6. Go live

### 4.2 Invitation-Only
Admin approves new sellers manually.

**Decision**: Self-service for sellers with auto-approval. Admin can review/suspend.

---

## 5. Product Types in Marketplace

### 5.1 Standard Products
Fixed price, no configuration. Example: "Circuit breaker 20A — R$45.00"

### 5.2 Configurable Products (CPQ)
Price determined by customer configuration. Example: "Custom Panel — from R$2.500"

**Implementation**:
- Product has `type=CPQ_CONFIGURABLE`
- CPQ template defines available options
- Configuration saved and added to cart as custom line item
- Pricing calculated server-side

### 5.3 Digital Products
Downloadable files, licenses (future).

---

## 6. Cart & Checkout Patterns

### 6.1 Session-Based Cart
Cart persists via session cookie for guests, linked to customer on login.

### 6.2 Multi-Item Cart
Cart contains products from multiple sellers (marketplace pattern).

**Implementation**:
```json
{
  "items": [
    { "sellerId": "tenant-a", "productId": "p1", "qty": 2 },
    { "sellerId": "tenant-b", "productId": "p2", "qty": 1, "configurationId": "cfg-123" }
  ]
}
```

### 6.3 Checkout Flow
```
Cart Review → Address → Shipping → Payment → Confirmation
```

**For marketplace**: Split payment between platform and sellers (future).

---

## 7. Order Lifecycle (Marketplace)

### 7.1 Order States
```
PENDING → CONFIRMED → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → DELIVERED
   ↓           ↓             ↓              ↓
CANCELLED   CANCELLED    CANCELLED      REFUNDED
```

### 7.2 Split Orders (future)
When cart has items from multiple sellers, create sub-orders per seller.

### 7.3 Fulfillment
- Seller receives order notification
- Seller confirms order
- Seller produces (CPQ items) or picks from inventory
- Seller ships
- Customer confirms delivery

---

## 8. Revenue Models

### 8.1 Subscription (SaaS)
Monthly/annual fee per seller. Tiered plans:
- **Free**: Limited products, basic features
- **Pro**: More products, CPQ module, advanced reports
- **Enterprise**: Unlimited, dedicated support, custom domain

### 8.2 Transaction Fees
Percentage of each sale (e.g., 2-5%).

### 8.3 Hybrid (our model)
Subscription + optional transaction fees. CPQ module as paid add-on.

---

## 9. Key Metrics (KPIs)

### 9.1 Platform Level
- GMV (Gross Merchandise Value)
- MRR (Monthly Recurring Revenue)
- Active sellers
- New seller signups
- Churn rate

### 9.2 Seller Level
- Sales revenue
- Order count
- Average order value
- Inventory turnover
- Customer acquisition cost

### 9.3 Technical
- API response time (p95 < 500ms)
- Error rate (< 0.1%)
- Uptime (99.9%)

---

## 10. Competitive Landscape

| Platform | Model | Strengths | Weaknesses |
|----------|-------|-----------|------------|
| **Shopify** | SaaS Storefront | Ease of use, app ecosystem | Monthly cost, transaction fees |
| **Nuvemshop** | LATAM Marketplace | Localized, omnichannel | Limited customization |
| **VTEX** | Enterprise Commerce | B2B features, OMS | Complex, expensive |
| **Tray** | Brazilian Platform | Local support, payment | Smaller ecosystem |
| **Mercado Livre** | Marketplace | Massive traffic, logistics | High fees, competition |
| **Amazon** | Global Marketplace | Reach, FBA | Fees, competition, limited branding |

**Our Differentiation**:
- Specialized in electrical panels/components
- Integrated CPQ builder for custom products
- Seller ERP included (inventory, financial, customers)
- Multi-tenant with white-label storefronts
- Brazilian market focus with local compliance (NF-e, LGPD)

---

## 11. References

- [Shopify Dev Docs](https://shopify.dev)
- [VTEX Developer Portal](https://developers.vtex.com)
- [Nuvemshop API](https://tiendanube.github.io/api-docs/)
- [Medusa Commerce](https://medusajs.com) (open-source marketplace)
- [Saleor](https://saleor.io) (GraphQL marketplace)
- Microservices.io patterns
