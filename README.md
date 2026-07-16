# CPQ Painéis Elétricos

SaaS de **Configure-Price-Quote (CPQ)** para fabricantes de painéis elétricos.
Monorepo gerenciado com **pnpm** + **turbo**.

## Stack

- **Backend**: NestJS 10 + Prisma 5 (PostgreSQL) + argon2 (password hashing) + JWT (auth)
- **Frontend**: (em construção) — `apps/web`
- **Banco**: PostgreSQL 16 (container Docker efêmero em dev)

## Estrutura

```
apps/
  api/        # NestJS API (auth, catalog, rules, configurations, quotes, bom, orders, shipments)
  web/        # Frontend (placeholder)
packages/
  config/     # Configurações compartilhadas do monorepo
docs/adr/     # Architecture Decision Records
```

## Domínio (vertical validado)

Fluxo ponta-a-ponta já exercitado via script reproduzível
(`apps/api/scripts/smoke-flow.sh`):

```
login → catalog → quote → configuration → submit-for-review
  → calculate → send → customer-approve → BOM → convert → advance (IN_PRODUCTION)
```

Regras de negócio centrais:

- **Isolamento multi-tenant**: todo endpoint exige headers `x-tenant-id`,
  `x-user-id` e `Authorization: Bearer <token>`.
- **Ciclo de orçamento**: `DRAFT → INTERNAL_REVIEW → CALCULATED → SENT →
  CUSTOMER_APPROVED → (convert) → ORDER CONFIRMED → IN_PRODUCTION → ...`
- **BOM versionado** por `quoteVersion` + `configurationSnapshot`.

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
pnpm prisma:migrate:deploy
pnpm seed

# 4. Subir API
pnpm dev   # porta 3000
```

## Scripts úteis (apps/api)

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | NestJS em watch |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm prisma:migrate:dev` | criar migration em dev |
| `pnpm prisma:migrate:deploy` | aplicar migrations (deploy) |
| `pnpm seed` | popular tenant/usuário/catálogo/regra/cliente |

## Validação da cadeia vertical

```bash
bash apps/api/scripts/smoke-flow.sh
```

Credenciais de seed: `admin@paineisdemo.com` / `SenhaForte@123`.
