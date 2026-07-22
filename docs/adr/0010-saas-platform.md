# ADR 0010 - SaaS Platform Foundation

O backend evoluiu de um CPQ single-tenant para uma plataforma SaaS multi-tenant com monetização. Decidimos adicionar seis módulos de plataforma sobre a arquitetura existing: Plan, Subscription, Billing (Stripe), Tenant Branding, I18n e Feature Flags.

## Decision

- **Plan/Subscription**: Modelo Plan + Subscription com status sync via Stripe webhooks
- **Stripe**: SDK oficial com Customer Billing + Portal; webhooks para lifecycle events
- **Tenant Branding**: Core + logo + custom domain (CNAME verification)
- **I18n**: next-intl no frontend + custom translation service no backend; pt-BR/en-US/es-ES no MVP
- **Feature Flags**: Guard baseado em plano; enforcement de limites (users, quotes/mês)
- **White-label MVP**: Cores + logo + custom domain (email sender fica para fase 2)

## Consequences

### Positive
- Monetização via Stripe Billing com mínima fricção
- Tenant isolation preservado (RLS + feature flags)
- Arquitetura modular permite ativar/desativar features por plano
- Custom domain permite white-label sem subdomínios

### Negative
- Stripe dependency = vendor lock-in para billing
- Custom domain requer DNS validation (complexidade operacional)
- i18n no backend exige sync entre frontend e backend translations

## Alternatives considered

- **Paddle/Lemonsyssy vs Stripe**: Stripe escolhido por market share + Stripe Tax para internacional
- **Schema-per-tenant vs Row-level**: Row-level para MVP (simples); schema-per-tenant como upgrade Enterprise
- **SaaS Pricing**: Flat-rate vs usage-based: escolhemos híbrido (base + usage para quotes)
