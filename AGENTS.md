# 1. Skills & Contexto

## Regras Obrigatórias
- **SEMPRE carregar todas as skills disponíveis e relevantes antes de iniciar qualquer tarefa. Incluindo Skills de Código**
- **SEMPRE ler README.md antes de qualquer análise ou implementação.**
- **SEMPRE ler CONTEXT.md quando existir.**
- **SEMPRE ler AGENTS.md, CLAUDE.md, COPILOT.md, GEMINI.md ou qualquer documento de instruções do projeto antes de executar qualquer ação.**
- **SEMPRE identificar e seguir os padrões arquiteturais, de código e de organização já existentes no projeto.**
- **NUNCA assumir a estrutura, convenções ou dependências do projeto sem verificá-las previamente.**
- **NUNCA assumir que uma biblioteca, pacote, framework, ferramenta, comando ou API existe sem confirmar sua existência na documentação oficial ou no próprio projeto.**
- **Caso existam múltiplos documentos de contexto, carregá-los em ordem de prioridade definida pelo projeto; na ausência dessa definição, carregar todos antes de iniciar a tarefa.**
- **Sempre leia toda a documentação do projeto**

# Agent Instructions — CPQ Painéis Elétricos

Multi-tenant SaaS CPQ + marketplace for electrical panel manufacturers. Monorepo: **pnpm 9 + turbo**.

## Structure

```
apps/
  api/    # NestJS 10 — global prefix /api/v1, port 3000
  web/    # Next.js 15 (App Router) — port 3001
packages/
  ui/       # placeholder
  config/   # placeholder
  shared/   # placeholder
```

Web has 3 route groups: `(storefront)` (public), `seller` (ERP staff), `admin` (super admin).

## Commands

```bash
# From repo root
pnpm run dev        # turbo runs dev in all packages (api + web)
pnpm run build      # turbo runs build (topological, deps first)
pnpm run typecheck  # turbo runs typecheck
pnpm run lint       # turbo runs lint

# API only
cd apps/api
pnpm run test           # Jest — *.spec.ts files in src/
pnpx prisma migrate dev # create/apply migration
npx prisma generate     # regenerate client (required after schema change)
npx prisma studio       # DB GUI

# Web only
cd apps/web
pnpm run dev            # Next.js dev on :3001

# Docker (full stack: postgres + redis + api + web + nginx on :80)
docker compose up -d
```

## Environment

**API** (`apps/api/.env`): `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (required — app crashes if missing). Also `PORT`, `CORS_ORIGIN`, `REDIS_URL`.

**Web** (`apps/web/.env.local`): `NEXTAUTH_SECRET`, `API_BASE_URL` (client-side, `http://localhost:3000/api/v1`), `INTERNAL_API_URL` (server-side, `http://api:3000/api/v1`).

Generate secrets: `openssl rand -base64 32`.

## Critical Architecture

**Tenant isolation is automatic.** `TenantScopeInterceptor` reads `user.tenantId` from the JWT and propagates it through AsyncLocalStorage. Prisma middleware applies `tenantId` filters to every query. Never manually add `tenantId` to queries — the middleware handles it. Auth routes (`/auth/login`, `/auth/refresh`) are intentionally excluded (no user in request).

**CORS is fail-closed.** If `CORS_ORIGIN` is unset, CORS is disabled.

**Validation pipe is global** with `whitelist: true` + `forbidNonWhitelisted: true`. Unknown fields in DTOs cause 400 errors — not silent stripping.

**Correlation ID** propagates via `x-correlation-id` header (reuses incoming or generates UUID). Present in every response header.

**Swagger** at `/api/docs` — only available when `NODE_ENV !== 'production'`.

## Testing

- API: Jest + ts-jest. Spec files must be `*.spec.ts` inside `src/`.
- Run single test: `cd apps/api && npx jest path/to/file.spec.ts`
- Coverage thresholds: branches ≥70%, functions/lines/statements ≥80%. Client runs `**/*.service.ts` only.
- Web: no test runner configured yet.

## Prisma Gotchas

- After editing `prisma/schema.prisma`, run `npx prisma generate` before importing `@prisma/client`.
- Prisma Client output (`node_modules/.prisma/`) is gitignored — it's regenerated, not committed.
- Seed uses a separate tsconfig: `ts-node --project tsconfig.seed.json prisma/seed.ts`.

## What NOT to do

- Don't add `awesome-zoocode-skills/` content — it's a separate project (gitignored).
- Don't add manual `tenantId` filters — the interceptor handles isolation.
- Don't add CORS config manually — it's env-driven and fail-closed by design.
- Don't create DTOs with extra fields — `forbidNonWhitelisted` will reject them.

## Docs

- `CONTEXT.md` — ubiquitous language (domain terms, lifecycle statuses, module boundaries)
- `docs/PROJECT_STATUS.md` — roadmap, module status, credentials
- `docs/adr/` — 13 architecture decision records
