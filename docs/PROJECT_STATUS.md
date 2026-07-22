# CPQ Marketplace — Estado do Projeto (Julho 2026)

## Visão Geral

SaaS multi-tenant de **marketplace para fabricantes de painéis elétricos e componentes**. Monorepo com NestJS (backend) e Next.js 15 (frontend com 3 apps).

O **CPQ é um módulo** dentro do marketplace — uma funcionalidade que permite ao cliente configurar painéis personalizados. O core do sistema é o marketplace com carrinho, checkout e ERP do vendedor.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | NestJS 10 + Prisma 5 + PostgreSQL 16 |
| **Frontend** | Next.js 15 (App Router) + Tailwind + shadcn/ui |
| **Auth** | NextAuth v5 (Credentials Provider) + JWT |
| **State** | Zustand (local) + React Query (server data) |
| **Cache** | Redis 7 |
| **Validação** | class-validator + pipes NestJS |
| **Container** | Docker + Docker Compose |
| **Reverse Proxy** | nginx |

---

## Estrutura do Monorepo

```
apps/
  api/          # NestJS API (auth, marketplace, cart, orders, cpq, seller, admin)
  web/          # Next.js frontend (storefront + seller ERP + admin)
packages/
  ui/           # (placeholder) Shared component library
  config/       # (placeholder) Shared configs (ESLint, TS)
  shared/       # (placeholder) Shared types and utilities
docs/
  adr/          # 13 Architecture Decision Records
  architecture/ # Diagrams (C4 + ER) + reference
  research/     # Market research and patterns
```

---

## URLs de Desenvolvimento

| Serviço | URL |
|---------|-----|
| Storefront | http://localhost |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/api/docs |
| Prisma Studio | `npx prisma studio` |

---

## Módulos Backend (Implementados)

| Módulo | Prefixo | Status | Descrição |
|--------|---------|--------|-----------|
| Auth | `/auth` | ✅ | Login, refresh, validate JWT |
| Marketplace | `/products`, `/categories` | 🚧 | Catálogo de produtos (standard + CPQ) |
| Cart | `/cart` | 🚧 | Carrinho de compras |
| Orders | `/orders` | 🚧 | Pedidos e lifecycle |
| CPQ | `/cpq` | ✅ | Configurações, componentes, pricing |
| Seller ERP | `/seller` | 🚧 | Painel do vendedor |
| Admin | `/admin` | ✅ | Gestão da plataforma |
| Platform | `/plans`, `/billing` | ✅ | Assinaturas e billing |
| ERP | `/erp` | ✅ | Fiscal, financeiro, estoque, compras |
| Privacy | `/privacy` | ✅ | LGPD compliance |
| Tenancy | (global) | ✅ | Multi-tenant isolation (RLS) |

Legenda: ✅ Implementado | 🚧 Em desenvolvimento | 📋 Planejado

---

## Frontend Apps

| App | Rota | Status | Descrição |
|-----|------|--------|-----------|
| Storefront | `/` | ✅ | Página inicial, catálogo, carrinho, checkout |
| Seller ERP | `/seller` | 📋 | Dashboard, produtos, pedidos, estoque |
| Admin | `/admin` | 🚧 | Gestão de tenants, usuários, billing |

---

## Credenciais de Acesso

| Perfil | Email | Senha | Tenant |
|--------|-------|-------|--------|
| **Super Admin** | super@cpq.com.br | Super@2024! | Plataforma (todos) |
| **Demo Admin** | admin@paineisdemo.com | SenhaForte@123 | demo-paineis |

---

## Modelo de Dados (Principais Entidades)

```
Tenant (Lojista)
├── User (com Membership → Role)
├── Product (Standard ou CPQ_CONFIGURABLE)
├── Category
├── Cart + CartItem
├── Customer
├── Order + OrderItem
├── InventoryItem + StockMovement
├── FinancialAccount + FinancialTransaction
└── CPQ Configuration + Components
```

---

## Roadmap

### Fase 1 — Marketplace Foundation 🚧
- [x] Multi-tenant isolation (RLS + middleware)
- [x] Auth system (JWT + NextAuth)
- [x] CPQ module (configurações, componentes, pricing)
- [ ] Product catalog (standard + CPQ configurable)
- [ ] Shopping cart
- [ ] Checkout (mocked payment)
- [ ] Order lifecycle
- [ ] Storefront frontend (home, catalog, product page)
- [ ] CPQ integration in product page + cart

### Fase 2 — Seller ERP 📋
- [ ] Seller registration (self-service)
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Inventory management
- [ ] Customer management
- [ ] Financial module
- [ ] Reports and analytics

### Fase 3 — Admin Platform 🚧
- [ ] Tenant management (CRUD)
- [ ] User management
- [ ] Subscription/billing management
- [ ] Platform analytics
- [ ] System settings

### Fase 4 — Integration & Polish 📋
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] File uploads (product images)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline
- [ ] VPS deployment
- [ ] Monitoring (Prometheus/Grafana)

---

## Comandos Úteis

```bash
# Desenvolvimento
pnpm run dev              # Inicia tudo (turbo)
pnpm run build            # Build completo
pnpm run typecheck        # Typecheck completo
pnpm run lint             # Lint

# Docker
docker compose up -d      # Subir todos os containers
docker compose down       # Parar tudo
docker compose logs -f api  # Ver logs da API

# Backend (apps/api)
cd apps/api
npx prisma migrate dev    # Criar/aplicar migration
npx prisma generate       # Gerar Prisma Client
npx prisma db push        # Sync schema (dev)
npx prisma studio         # GUI do banco
pnpm run test             # Testes

# Typecheck
cd apps/api && pnpm run typecheck
cd apps/web && pnpm run typecheck
```

---

## Variáveis de Ambiente

### Backend (apps/api/.env)
```
DATABASE_URL=postgresql://cpq:cpq@localhost:5432/cpq
JWT_ACCESS_SECRET=<gerar>
JWT_REFRESH_SECRET=<gerar>
PORT=3000
CORS_ORIGIN=http://localhost
REDIS_URL=redis://localhost:6379
```

### Frontend (apps/web/.env.local)
```
NEXTAUTH_URL=http://localhost
NEXTAUTH_SECRET=<gerar com openssl rand -base64 32>
API_BASE_URL=http://localhost:3000/api/v1
INTERNAL_API_URL=http://api:3000/api/v1
NEXT_PUBLIC_APP_NAME=CPQ Marketplace
```

---

## Decisões Arquiteturais (ADRs)

| ADR | Título | Status |
|-----|--------|--------|
| 0001 | Multi-Tenant Marketplace Isolation | Accepted |
| 0002 | Storefront Pública | Accepted |
| 0003 | Product Catalog | Accepted |
| 0004 | Cart & Checkout | Accepted |
| 0005 | Order Lifecycle | Accepted |
| 0006 | Seller ERP Panel | Accepted |
| 0007 | CPQ Module Within Marketplace | Accepted |
| 0008 | Admin Platform | Accepted |
| 0009 | Concurrency & Consistency | Accepted |
| 0010 | Security Architecture | Accepted |
| 0011 | API Design (REST) | Accepted |
| 0012 | Frontend Architecture (Three Apps) | Accepted |
| 0013 | DevOps & Infrastructure | Accepted |

---

## Notas Importantes

1. **Multi-tenant**: Todo dado é isolado por `tenantId`. O interceptor global garante escopo.
2. **CPQ é módulo**: O builder de painéis é uma feature dentro do marketplace, não o produto principal.
3. **3 apps frontend**: Storefront (público), Seller ERP (lojista), Admin (plataforma).
4. **Pagamento mockado**: Checkout cria pedido sem processar pagamento real.
5. **Isolamento**: Cada lojista vê apenas seus próprios dados via RLS.
