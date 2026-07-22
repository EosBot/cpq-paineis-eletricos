# ADR 0011 - Phase 1 SaaS Review Fixes

After implementing the SaaS Platform modules (Plan, Subscription, Billing, Tenant, I18n, Feature), a thorough review identified 22 issues. All critical and high-priority fixes were applied.

## Decision

Applied comprehensive fixes organized by severity:

### Critical Bugs Fixed

1. **Subscription tenantId swapped with planId** — `subscription.controller.ts` was setting `tenantId: dto.planId`. Fixed by extracting tenantId from query parameter instead of body.

2. **Route ordering** — `plan.controller.ts` had `@Get(':id')` before `@Get('code/:code')`, making `findByCode` unreachable. Reordered routes.

3. **GET endpoints reading from body** — `feature.controller.ts` and `tenant.controller.ts` used `@Body()` on GET requests. Changed to `@Query()`.

4. **DTO type mismatch** — `billingPeriod` typed as `Prisma.EnumBillingPeriodFilter` instead of `'MONTHLY' | 'YEARLY'`. Fixed.

5. **Stripe crash on startup** — `StripeService` constructor threw when `STRIPE_SECRET_KEY` not configured. Made Stripe lazy-initialized with graceful degradation.

### Security Fixes

6. **Domain enumeration** — `tenant.controller.ts:34` exposed verified domains. Added auth consideration note.

7. **Webhook error handling** — `billing.controller.ts` threw raw `Error` (500) instead of `BadRequestException` (400).

### Code Quality Fixes

8. **Hardcoded values** — `PLATFORM_DOMAIN`, `STRIPE_TRIAL_DAYS`, `localhost:5173` URLs. Moved to ConfigService with proper error messages.

9. **Feature config duplication** — `FeatureService` had hardcoded `PLAN_CONFIGS` while `Plan.features` DB field was unused. Now reads from DB.

10. **JSON type casting** — `PlanService` used `as Prisma.InputJsonValue`. Removed unnecessary casts.

11. **TranslationMap not exported** — `I18nService.TranslationMap` was private interface. Exported.

12. **Stripe API version hardcoded** — Removed explicit `apiVersion` to use SDK default.

## Alternatives considered

- **Stripe optional provider** vs lazy getter: Lazy getter chosen for simplicity (no module restructuring)
- **DB-only features** vs hybrid: DB-only chosen for MVP (simpler admin)

## Consequences

### Positive
- API starts without Stripe configured (dev/test friendly)
- Feature flags driven by DB (admin can configure without deploy)
- All endpoints follow REST semantics (GET uses @Query)
- No hardcoded environment values

### Negative
- StripeService throws at runtime if used without config (not compile-time safe)
- Some endpoints still missing auth guards (deferred to auth sprint)
