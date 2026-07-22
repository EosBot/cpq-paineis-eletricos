# ADR-0012: Frontend Architecture (Three Apps)

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The marketplace requires three distinct user interfaces: Storefront (customer), Seller ERP (merchant), and Admin (platform). Each has different requirements, audiences, and interaction patterns.

## Decision

Build three separate Next.js applications within the monorepo, sharing a common UI component library. Each app is independently deployable but shares the same backend API.

### App Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (storefront)/     # Public storefront
│   │   ├── (seller)/         # Seller ERP
│   │   ├── (admin)/          # Admin platform
│   │   └── api/              # NextAuth routes
│   ├── components/
│   │   ├── ui/               # Shared UI primitives
│   │   ├── layout/           # Layout components
│   │   ├── storefront/       # Storefront-specific
│   │   ├── seller/           # Seller-specific
│   │   ├── admin/            # Admin-specific
│   │   └── builder/          # CPQ builder components
│   ├── lib/
│   │   ├── api/              # API client
│   │   ├── auth/             # Auth config
│   │   ├── hooks/            # Shared hooks
│   │   └── utils/            # Utilities
│   └── store/                # Zustand stores
```

### Route Groups

Route groups `(name)` in Next.js App Router allow organizing routes without affecting the URL structure:

| Group | URL Prefix | Audience |
|-------|-----------|----------|
| `(storefront)` | `/` | Public customers |
| `(seller)` | `/seller` | Seller staff |
| `(admin)` | `/admin` | Super admins |

### Shared UI Library

```
apps/web/src/components/ui/
├── button.tsx           # CVA-powered button
├── card.tsx             # Card + subcomponents
├── input.tsx            # Form inputs
├── dialog.tsx           # Modal dialogs
├── table.tsx            # Data tables
├── toast.tsx            # Notifications
├── skeleton.tsx         # Loading skeletons
└── form.tsx             # Form components
```

Built on **shadcn/ui** pattern (CVA + Tailwind + Radix primitives).

### State Management

| Scope | Solution | Usage |
|-------|----------|-------|
| Server data | React Query | API calls, caching |
| Global UI | Zustand | Theme, sidebar, modals |
| Form state | React Hook Form | Complex forms |
| Cart | Zustand + persistence | Shopping cart |
| Builder | Zustand | CPQ configuration state |

### API Client

```typescript
// Server-side (async components)
const data = await api.get('/products');

// Client-side (hooks)
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: () => api.get('/products'),
});
```

### Authentication Flow

```
Customer → /account/login → NextAuth → JWT Cookie → Storefront
Seller   → /seller/login  → NextAuth → JWT Cookie → Seller ERP
Admin    → /admin/login   → NextAuth → JWT Cookie → Admin Panel
```

All use the same Credentials provider but with different redirect targets.

### Deployment

| App | Domain | Build |
|-----|--------|-------|
| Storefront | `localhost` or custom | `next build` → standalone |
| Seller | `seller.localhost` | `next build` → standalone |
| Admin | `admin.localhost` | `next build` → standalone |

### Shared Packages (future)

```
packages/
├── ui/                    # Shared component library
├── config/                # Shared configs (ESLint, TS)
├── types/                 # Shared TypeScript types
└── utils/                 # Shared utilities
```

## Consequences

### Positive
- Each app optimized for its audience
- Shared UI ensures consistency
- Independent deployment per app
- Route groups keep URLs clean

### Negative
- Code duplication across apps
- Three builds to maintain
- Shared state across apps is challenging
- Bundle size larger than single app
