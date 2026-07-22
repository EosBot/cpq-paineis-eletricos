# CPQ Painéis Elétricos

SaaS multi-tenant de **Configure-Price-Quote (CPQ)** para fabricantes de painéis elétricos. Monorepo gerenciado com **pnpm** + **turbo**.

## Stack

- **Backend**: NestJS 10 + Prisma 5 (PostgreSQL) + argon2 + JWT
- **Frontend**: Next.js 15 (App Router) + Tailwind + shadcn/ui + Framer Motion + React Three Fiber
- **Auth**: NextAuth v5 (Credentials Provider) + JWT
- **3D**: Three.js + React Three Fiber + drei
- **State**: Zustand (builder local) + React Query (server data)
- **Banco**: PostgreSQL 16

## Estrutura

```
apps/
  api/        # NestJS API (auth, catalog, panel-builder, quotes, bom, orders, erp, lgpd, super-admin)
  web/        # Next.js frontend (builder wizard, admin dashboard, login)
packages/
  config/     # Configurações compartilhadas
  shared/     # (placeholder)
  ui/         # (placeholder)
docs/
  research/   # Pesquisas de mercado (panel-builder, electrical-market)
  adr/        # Architecture Decision Records (0001-0012)
```

## URLs de Desenvolvimento

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/api/docs |
| Prisma Studio | `npx prisma studio` |

## Setup (dev)

```bash
# 1. Postgres efêmero
docker run -d --name cpq-postgres -e POSTGRES_USER=cpq -e POSTGRES_PASSWORD=cpq \
  -e POSTGRES_DB=cpq -p 5432:5432 postgres:16

# 2. Instalar deps
pnpm install

# 3. Banco + migrations
cd apps/api
export DATABASE_URL="postgresql://cpq:cpq@localhost:5432/cpq"
npx prisma migrate deploy
npx ts-node --project tsconfig.seed.json prisma/seed.ts

# 4. Subir tudo
cd ../..
pnpm run dev   # API na 3000, Web na 3001
```

## Frontend

| Rota | Descrição | Proteção |
|------|-----------|----------|
| `/login` | Autenticação (NextAuth) | Público |
| `/configure` | Builder wizard (5 etapas) | Autenticado |
| `/admin` | Super Admin dashboard | Super Admin |

```bash
cd apps/web
npm run dev    # http://localhost:3001
```

Variáveis em `apps/web/.env.local`:

```
NEXTAUTH_SECRET=<gerar>
API_BASE_URL=http://localhost:3000/api/v1
```

## Credenciais

| Perfil | Email | Senha |
|--------|-------|-------|
| **Super Admin** | super@cpq.com.br | Super@2024! |
| **Demo Admin** | admin@paineisdemo.com | SenhaForte@123 |
| **Demo Engineer** | engenheiro@paineisdemo.com | Eng@2024 |
| **Demo Sales** | vendas@paineisdemo.com | Vendas@2024 |

## Domínio (vertical validado)

Fluxo ponta-a-ponta:

```
login → catalog → quote → configuration → submit-for-review
  → calculate → send → customer-approve → BOM → convert → advance (IN_PRODUCTION)
```

Regras de negócio centrais:

- **Isolamento multi-tenant**: todo dado é scopado por `tenantId` via interceptor global.
- **Ciclo de orçamento**: `DRAFT → INTERNAL_REVIEW → CALCULATED → SENT → CUSTOMER_APPROVED → ORDER → ...`
- **BOM versionado** por `quoteVersion` + `configurationSnapshot`.
- **LGPD compliance**: módulo de privacy com consent, data subject requests, export, audit.

## Observabilidade & Segurança

- **Correlation ID**: header `X-Correlation-ID` em todo response.
- **Log estruturado**: JSON com `correlationId` e `tenantId`.
- **Audit log**: `GET /api/v1/audit-logs` (admin only).
- **Swagger/OpenAPI**: `GET /api/docs` e `GET /api/docs-json`.
- **CORS**: configurável via `CORS_ORIGIN` no `.env` da API (fail-closed).
- **Rate limiting**: 20 req/min por IP.
- **LGPD**: consent management, data subject rights, anonymization, DPO config.

## Módulos Backend

| Módulo | Endpoints |
|--------|-----------|
| Auth | `/auth/login`, `/auth/refresh`, `/auth/validate` |
| Catalog | `/catalog/components`, `/catalog/component-categories` |
| PanelBuilder | `/panel-builder/catalog`, `/templates`, `/regions`, `/configurations`, `/rails`, `/circuits`, `/placements`, `/pricing` |
| Quotes | `/quotes`, `/quotes/:id/calculate`, `/quotes/send`, `/quotes/customer-approve` |
| ERP | `/erp/sales`, `/erp/inventory`, `/erp/procurement`, `/erp/fiscal`, `/erp/financial` |
| SuperAdmin | `/super-admin/stats`, `/super-admin/tenants`, `/super-admin/users` |
| Privacy (LGPD) | `/privacy/config`, `/consents`, `/data-requests`, `/export-data`, `/audit-logs` |

## Documentação Adicional

- [Estado do Projeto](docs/PROJECT_STATUS.md) — visão geral completa
- [ADR 0012 — Frontend Architecture](docs/adr/0012-frontend-architecture.md)
- [Pesquisa: Panel Builder](docs/research/panel-builder-research.md)
- [Pesquisa: Mercado Elétrico BR](docs/research/electrical-market-brazil.md)
