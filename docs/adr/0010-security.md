# ADR-0010: Security Architecture

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The marketplace handles sensitive data: customer PII, payment information, seller business data, and proprietary CPQ configurations. Security must be defense-in-depth.

## Decision

Implement multiple layers of security controls following OWASP Top 10 and API Security Top 10.

### Security Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Network (WAF, TLS, Rate Limit)    │
├─────────────────────────────────────────────┤
│  Layer 2: Transport (HTTPS, HSTS)           │
├─────────────────────────────────────────────┤
│  Layer 3: Application (Auth, CORS, CSP)     │
├─────────────────────────────────────────────┤
│  Layer 4: Tenant (RLS, Scope Isolation)     │
├─────────────────────────────────────────────┤
│  Layer 5: Data (Encryption, Hashing)        │
└─────────────────────────────────────────────┘
```

### Authentication

- **JWT Access Token**: 15 min expiry, signed with HS256
- **Refresh Token**: 7 day expiry, stored hashed in DB, rotation on use
- **Session**: NextAuth v5 for frontend sessions (encrypted JWT)
- **Multi-tenant**: JWT contains `tenantId` derived from user's active membership

### Authorization

```typescript
// Controller level
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'seller')
async sellerEndpoint() {}

// Method level
@Roles('admin')
async adminOnlyEndpoint() {}

// Data level (automatic via middleware)
// All queries filtered by tenantId from JWT
```

### Input Validation

- **ValidationPipe** global: `whitelist: true, forbidNonWhitelisted: true, transform: true`
- **DTOs** with `class-validator` decorators
- **File uploads**: Type whitelist, size limit, virus scan (future)

### Data Protection

| Data | Protection |
|------|-----------|
| Passwords | argon2id hashing (memory=64MB, iterations=3) |
| PII (customer data) | Encrypted at rest (AES-256) |
| API keys | Hashed in DB, shown once on creation |
| Sessions | Encrypted JWT with NEXTAUTH_SECRET |
| Database connections | SSL/TLS required |

### OWASP Mitigations

| Risk | Mitigation |
|------|-----------|
| A01: Broken Access | Tenant guard + RBAC on every endpoint |
| A02: Crypto Failures | argon2, TLS 1.3, no custom crypto |
| A03: Injection | Prisma parameterized queries, input validation |
| A04: Insecure Design | Tenant isolation by default, deny-by-default |
| A05: Security Misconfig | Helmet, CORS whitelist, env-based config |
| A06: Vulnerable Components | Dependabot, npm audit in CI |
| A07: Auth Failures | JWT rotation, rate limiting, lockout |
| A08: Data Integrity | Signed webhooks, audit logs |
| A09: Logging Failures | Structured logging, correlation IDs |
| A10: SSRF | URL allowlist, no user-supplied URLs |

### Rate Limiting

```typescript
ThrottlerModule.forRoot([
  { ttl: 60_000, limit: 20 },    // 20 req/min general
  { ttl: 60_000, limit: 5 },     // 5 req/min auth endpoints
])
```

## Consequences

### Positive
- Defense-in-depth with multiple security layers
- Tenant isolation prevents data leakage
- Industry-standard authentication and authorization
- OWASP compliance reduces attack surface

### Negative
- Multiple guards add latency to every request
- Token rotation requires client-side handling
- Rate limiting may affect legitimate bulk operations
- Security audit logging adds storage requirements
