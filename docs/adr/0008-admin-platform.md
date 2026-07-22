# ADR-0008: Admin Platform

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The platform needs an administrative panel for super admins to manage tenants (sellers), users, billing, and platform-wide analytics.

## Decision

Build an admin dashboard accessible at `/admin`, restricted to users with `isSuperAdmin=true`. The admin panel provides platform-level oversight and management.

### Architecture

```
Admin Panel (/admin)
├── Dashboard — Platform KPIs
├── Tenants — Seller management
├── Users — User management across tenants
├── Billing — Subscriptions and invoices
├── Analytics — Platform-wide metrics
└── Settings — Global configuration
```

### Modules

#### 1. Dashboard
- Total active tenants
- Total users across platform
- Monthly recurring revenue (MRR)
- New tenant signups
- Platform health metrics

#### 2. Tenants (Sellers)
```typescript
Admin Tenant API:
  GET    /admin/tenants           — List all tenants
  POST   /admin/tenants           — Create new tenant
  GET    /admin/tenants/:id       — Tenant detail
  PATCH  /admin/tenants/:id       — Update tenant (plan, status)
  POST   /admin/tenants/:id/suspend — Suspend tenant
  DELETE /admin/tenants/:id       — Delete tenant (with data)
```

#### 3. Users
```typescript
Admin User API:
  GET    /admin/users             — List all users
  GET    /admin/users/:id         — User detail
  PATCH  /admin/users/:id         — Update user
  POST   /admin/users/:id/suspend — Suspend user
  DELETE /admin/users/:id         — Delete user
```

#### 4. Billing
```typescript
Admin Billing API:
  GET    /admin/billing/subscriptions — List subscriptions
  POST   /admin/billing/invoices      — Create invoice
  GET    /admin/billing/revenue       — Revenue analytics
```

### UI Structure

```
apps/web/src/app/admin/
├── layout.tsx              # Admin layout with sidebar
├── page.tsx                # Dashboard
├── tenants/
│   ├── page.tsx            # Tenant list
│   ├── new/page.tsx        # Create tenant
│   └── [id]/page.tsx       # Tenant detail
├── users/
│   ├── page.tsx            # User list
│   └── [id]/page.tsx       # User detail
├── billing/
│   └── page.tsx            # Billing overview
└── settings/
    └── page.tsx            # Platform settings
```

### Super Admin Guard

```typescript
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.isSuperAdmin === true;
  }
}
```

## Consequences

### Positive
- Platform-level management in one place
- Tenant lifecycle management (create → suspend → delete)
- Revenue tracking and billing oversight
- User management across all tenants

### Negative
- Cross-tenant data access requires careful filtering
- Deleting a tenant cascades to all their data
- Admin actions need audit logging
- Security critical — admin access is powerful
