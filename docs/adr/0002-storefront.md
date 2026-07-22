# ADR-0002: Storefront Pública (Customer-Facing)

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The marketplace needs a public-facing storefront where end customers browse products, add to cart, and checkout. This is the primary sales channel for all sellers on the platform.

## Decision

Build the storefront as a Next.js 15 application using App Router with React Server Components. The storefront is the default entry point for unauthenticated users and serves as the seller's public store.

### Architecture

```
Storefront (Next.js App Router)
├── / (Home) — Featured products, categories, search
├── /products — Product catalog with filters
├── /products/[slug] — Product detail page
│   └── Tab: "Monte seu Painel" → CPQ Builder
├── /cart — Shopping cart
├── /checkout — Checkout flow (mocked payment)
├── /account — Customer account area
│   ├── /account/login
│   ├── /account/register
│   └── /account/orders
└── /[sellerSlug] — Seller store page (future)
```

### Key Design Choices

1. **Server Components by default**: Better performance, SEO, initial load
2. **Client Components only for interactivity**: Cart, forms, CPQ builder
3. **API calls server-side**: Use `INTERNAL_URL` for backend communication
4. **Tenancy by domain**: Each seller gets custom domain or subdomain

### CPQ Integration

The CPQ builder is integrated as a **feature within the product page**, not a standalone application:

- Product with `type=CPQ_CONFIGURABLE` shows a "Monte seu Painel" tab
- The CPQ builder opens as a modal/section within the product page
- Configured products are added to cart as custom line items
- Cart shows "Personalizar" button for CPQ items to re-open editor

### Authentication

- Customers can browse without authentication
- Login required for checkout and account area
- NextAuth v5 with Credentials provider (email + password)
- Session stored as JWT with tenant context

## Consequences

### Positive
- Modern, performant storefront with excellent SEO
- CPQ is seamlessly integrated as a product feature
- Server-side rendering enables fast initial loads
- Shared component library across seller storefronts

### Negative
- CPQ builder must work as both standalone and embedded
- Cart state management requires client-side handling
- Multi-domain support adds complexity (future)

## References

- `apps/web/src/app/(storefront)/` — Storefront routes
- `apps/web/src/lib/auth/credentials.ts` — NextAuth config
- `apps/web/src/components/builder/builder-wizard.tsx` — CPQ Builder
- ADR-0003: Product Catalog (product types)
- ADR-0007: CPQ Module (integration details)
