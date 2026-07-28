# CPQ Painéis Elétricos — Estado do Projeto

> **Última atualização:** 2026-07-27
> **Versão:** 1.2.1-demo

---

## Visão Geral

SaaS multi-tenant de **marketplace para fabricantes de painéis elétricos e componentes** com módulo CPQ integrado. Monorepo com NestJS (backend) e Next.js 15 (frontend com 3 apps).

**CPQ é um módulo** dentro do marketplace — uma funcionalidade que permite ao cliente configurar painéis personalizados.

## Stack

| Camada | Tecnologia |
|--------|------------|
| **Backend** | NestJS 10 + Prisma 5 + PostgreSQL 16 + Redis |
| **Frontend** | Next.js 15 (App Router) + Tailwind + shadcn/ui + Framer Motion |
| **Auth** | NextAuth v5 (Credentials Provider) + JWT + argon2 |
| **State** | Zustand (local) + React Query (server data) |
| **Pagamentos** | Stripe (Connect + Subscriptions + Payment Intents) |
| **Cache** | Redis 7 com fallback in-memory |
| **Container** | Docker + Docker Compose + Traefik |

---

## Módulos Backend

| Módulo | Prefixo | Status | Testes |
|--------|---------|--------|--------|
| Auth | `/auth` | ✅ | ✅ |
| Marketplace | `/products`, `/categories` | ✅ | ✅ |
| Cart | `/cart` | ✅ | ✅ |
| Orders | `/orders` | ✅ | ✅ |
| Panel Builder | `/panel-builder` | ✅ | - |
| Quotes | `/quotes` | ✅ | ✅ |
| Configurations | `/configurations` | ✅ | ✅ |
| Rules | `/rules` | ✅ | ✅ |
| BOM | `/bom` | ✅ | ✅ |
| Shipments | `/shipments` | ✅ | ✅ |
| Billing | `/billing` | ✅ | ✅ |
| Subscriptions | `/subscriptions` | ✅ | ✅ |
| Plans | `/plans` | ✅ | ✅ |
| Features | `/features` | ✅ | ✅ |
| ERP Financial | `/erp/financial` | ✅ | ✅ |
| ERP Fiscal | `/erp/fiscal` | ✅ | ✅ |
| ERP Inventory | `/erp/inventory` | ✅ | ✅ |
| ERP Procurement | `/erp/procurement` | ✅ | ✅ |
| ERP Sales | `/erp/sales` | ✅ | ✅ |
| Super Admin | `/super-admin` | ✅ | - |
| Privacy | `/privacy` | ✅ | ✅ |
| Upload | `/uploads` | ✅ | ✅ |
| Notifications | (service) | ✅ | ✅ |
| Cache | (global) | ✅ | - |
| Audit | `/audit-logs` | ✅ | - |
| Tenancy | (global) | ✅ | ✅ |

**Total:** 23 módulos, ~95 endpoints, 128 testes passando

---

## Frontend Apps

| App | Rotas | Status |
|-----|-------|--------|
| Storefront | `/`, `/products/*`, `/cart`, `/checkout`, `/configure/*`, `/account/*`, `/orders/*`, `/billing/*` | ✅ |
| Seller ERP | `/seller`, `/seller/products/*`, `/seller/templates`, `/seller/orders/*`, `/seller/inventory`, `/seller/customers/*`, `/seller/suppliers`, `/seller/financial` | ✅ |
| Admin | `/admin`, `/admin/tenants`, `/admin/users`, `/admin/billing` | ✅ |

**Total:** ~36 rotas, 11 componentes de UI

---

## Roadmap

### Fase 1 — Marketplace Foundation ✅ CONCLUÍDA
- [x] Multi-tenant isolation (RLS + middleware)
- [x] Auth system (JWT + NextAuth)
- [x] CPQ module (configurações, componentes, pricing)
- [x] Product catalog + seed (46 componentes brasileiros)
- [x] Shopping cart + cart merge
- [x] Checkout (Stripe Payment Intents)
- [x] Order lifecycle
- [x] Storefront frontend completo
- [x] CPQ integration in product page + cart

### Fase 2 — Seller ERP ✅ CONCLUÍDA
- [x] Dashboard com KPIs
- [x] Product management (CRUD + upload)
- [x] Order management (filtro, avançar, cancelar)
- [x] Inventory management (movimentação)
- [x] Customer management (CRUD)
- [x] Supplier management (CRUD)
- [x] Financial module (transações, relatórios)

### Fase 3 — Admin Platform ✅ CONCLUÍDA
- [x] Tenant management (CRUD, toggle ativo)
- [x] User management (listar, buscar, toggle)
- [x] Subscription/billing management
- [x] Platform analytics (stats globais)

### Fase 4 — Integration & Polish 🚧 EM ANDAMENTO
- [x] File uploads (product images)
- [x] Cache layer (Redis)
- [x] Idempotency support
- [x] Documentação da API
- [x] Seed de dados demo (5 users, 10 categorias, 26 produtos)
- [x] Endpoint de registro público (`POST /auth/register`)
- [x] Magic Link login (`POST /auth/magic-link`)
- [x] Frontend redesign (paleta premium, glass morphism, gradientes)
- [x] Página de login split-layout com animações
- [ ] Stripe Connect (tenant accounts)
- [ ] Stripe SaaS (platform subscriptions)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (parcial)
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Swagger decorators completos

---

## Qualidade & Testes

| Métrica | Valor | Status |
|---------|-------|--------|
| **Testes Backend** | 128 | ✅ |
| **Test Suites** | 25 | ✅ |
| **Cobertura** | ~75% | ✅ |
| **Typecheck** | Sem erros | ✅ |
| **E2E Tests** | Configurado | 🚧 |

---

## Documentação

| Documento | Status | Descrição |
|-----------|--------|-----------|
| `README.md` | ✅ | Visão geral e setup |
| `docs/FEATURES.md` | ✅ | Funcionalidades por módulo |
| `docs/CONTEXT.md` | ✅ | Linguagem ubíqua e roadmap |
| `docs/api/README.md` | ✅ | Índice da API |
| `docs/api/auth.md` | ✅ | Endpoints de auth |
| `docs/api/marketplace.md` | ✅ | Endpoints do marketplace |
| `docs/api/cpq.md` | ✅ | Endpoints do CPQ |
| `docs/api/erp.md` | ✅ | Endpoints do ERP |
| `docs/api/admin.md` | ✅ | Endpoints de admin |
| `docs/adr/` | ✅ | 13 Architecture Decision Records |
| `docs/architecture/` | ✅ | Diagramas C4 e ER |
| `docs/research/` | ✅ | Pesquisas de mercado |
| `apps/api/openapi.yaml` | ⚠️ | Gerado (schemas vazios) |

---

## Credenciais

| Perfil | Email | Senha |
|--------|-------|-------|
| **Super Admin** | super@cpq.com.br | Super@2024! |
| **Demo Admin** | admin@paineisdemo.com | SenhaForte@123 |
| **Demo Engineer** | engenheiro@paineisdemo.com | Eng@2024 |
| **Demo Sales** | vendas@paineisdemo.com | Vendas@2024 |

---

## Dados Seedados (Demo)

| Categoria | Quantidade | Descrição |
|-----------|------------|-----------|
| **Regiões** | 11 | Estados brasileiros (SP, RJ, MG, RS, BA, PE, CE, AM, DF, SC, PR) |
| **Templates CPQ** | 8 | CCM, QGBT, Automação, Distribuição, VFD, Bombeamento |
| **Componentes** | 84 | MCB, MCCB, Contatores, Relés, CLPs, VFD, Bornes, etc. |
| **Categorias** | 18 | Categorias de componentes elétricos |
| **Planos** | 3 | Starter (R$99), Pro (R$299), Enterprise (R$799) |
| **Produtos Demo** | 5 | CCM, QGBT, Distribuição, Automação (no tenant demo-paineis) |
| **Clientes Demo** | 4 | Clientes de exemplo (no tenant demo-paineis) |
| **Tenants** | 3 | demo-paineis, mega-paineis + tenant por registro |

---

## Planos de Assinatura

| Plano | Preço/mês | Produtos | Orçamentos | Suporte |
|-------|-----------|----------|------------|---------|
| **Starter** | R$ 99 | 10 | 5/mês | Email |
| **Pro** | R$ 299 | 100 | Ilimitado | Chat |
| **Enterprise** | R$ 799 | Ilimitado | Ilimitado | 24/7 Prioritário |

---

## Tipos de Painel CPQ

| Tipo | Descrição | Tensão |
|------|-----------|--------|
| **MONOFASICO** | 1 Fase + Neutro | 127V |
| **BIFASICO** | 2 Fases + Neutro | 220V |
| **TRIFASICO** | 3 Fases | 380V/220V |
| **CCM** | Centro de Controle de Motores | - |
| **QGBT** | Quadro Geral de Baixa Tensão | - |
| **CCMI** | CCM com Inversores | - |
| **AUTOMACAO** | Painel de Automação com CLP | - |
| **DISTRIBUICAO** | Quadro de Distribuição | - |
| **VFD_PANEL** | Painel com Inversor de Frequência | - |
| **PUMPING** | Painel de Bombeamento | - |

---

## Bugs Conhecidos & Fixes (2026-07-27)

### 🐛 Fix: CPQ UF/Region dropdown vazio + dados não carregam

**Problema:** O builder CPQ exibia dropdown de UF (estado) vazio, categorias e configurações não carregavam. O site parecia "quebrado" pois o builder depende desses dados.

**Root Cause:** Os hooks `useRegions()`, `useCategories()`, `useConfigurations()`, `useConfiguration()`, `usePricing()` em `apps/web/src/lib/api/hooks/use-panel-builder.ts` aplicavam `.then((r) => r.data)` esperando um envelope `{ data: [...] }`, mas a API retorna arrays/objetos diretamente (sem envelope).

**Fix Aplicado:**
- `useCategories()`: removido `.then((r) => r.data)` — API retorna array direto
- `useRegions()`: removido `.then((r) => r.data)` — API retorna array direto
- `useConfigurations()`: removido `.then((r) => r.data)` — API retorna array direto
- `useConfiguration()`: removido `.then((r) => r.data)` — API retorna objeto direto
- `usePricing()`: removido `.then((r) => r.data)` — API retorna objeto direto
- `useCatalog()`: **mantido** `.then((r) => r.data)` — API retorna `{ data: [...], meta: {...} }`
- `apps/web/src/app/configure/[configurationId]/page.tsx`: adicionado `as any[]` no cast de `categoriesQuery.data` e `regionsQuery.data`

**Status:** ✅ Corrigido e deployado em container Docker

### 🐛 Fix: API inacessível do navegador (proxy + middleware auth)

**Problema:** O frontend chamava `/api/v1/...` mas o Next.js não fazia proxy para o backend. O middleware também bloqueava requisições não autenticadas para `/api/v1/*`, redirecionando para `/login`.

**Root Cause:**
1. `next.config.js` não tinha `rewrites` para redirecionar `/api/v1/*` → backend
2. `middleware.ts` não excluía `/api/v1/*` da exigência de autenticação
3. O rewrite usava `localhost:3000` mas dentro do container Docker o backend está em `api:3000`

**Fix Aplicado:**
- `next.config.js`: adicionado `rewrites` para proxy `/api/v1/:path*` → `http://api:3000/api/v1/:path*`
- `middleware.ts`: adicionado `pathname.startsWith('/api/v1/')` como rota pública
- `INTERNAL_API_URL` agora usa `http://api:3000/api/v1` como fallback (nome do serviço Docker)

**Status:** ✅ Corrigido e deployado em container Docker
