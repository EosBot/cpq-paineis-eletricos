# CPQ Painéis Elétricos — Estado do Projeto (Julho 2026)

## Visão Geral

SaaS multi-tenant de **Configure-Price-Quote (CPQ)** para fabricantes de painéis elétricos. Monorepo Turbo com NestJS (backend) e Next.js 15 (frontend).

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | NestJS 10 + Prisma 5 + PostgreSQL 16 |
| **Frontend** | Next.js 15 (App Router) + Tailwind + shadcn/ui |
| **Auth** | NextAuth v5 (Credentials Provider) + JWT |
| **State** | Zustand (builder local) + React Query (server data) |
| **3D** | Three.js + React Three Fiber + drei |
| **Animações** | Framer Motion (springs, Apple-style) |
| **Validação** | class-validator + pipes NestJS |

---

## Estrutura do Monorepo

```
apps/
  api/          # NestJS API (auth, catalog, builder, quotes, erp, lgpd, super-admin)
  web/          # Next.js frontend (builder, admin, login)
packages/
  ui/           # (placeholder)
  config/       # (placeholder)
  shared/       # (placeholder)
docs/
  research/     # Pesquisas de mercado
  adr/          # Architecture Decision Records
```

---

## Credenciais de Acesso

| Perfil | Email | Senha | Tenant |
|--------|-------|-------|--------|
| **Super Admin** | super@cpq.com.br | Super@2024! | Plataforma (todos) |
| **Demo Admin** | admin@paineisdemo.com | SenhaForte@123 | demo-paineis |
| **Demo Engineer** | engenheiro@paineisdemo.com | Eng@2024 | demo-paineis |
| **Demo Sales** | vendas@paineisdemo.com | Vendas@2024 | demo-paineis |
| **Mega Painéis** | admin@megapaineis.com | Mega@2024 | mega-paineis |

---

## URLs de Desenvolvimento

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/api/docs |
| Prisma Studio | `npx prisma studio` |

---

## Módulos Backend (Registrados)

| Módulo | Prefixo | Endpoints |
|--------|---------|-----------|
| Auth | `/auth` | login, refresh, validate |
| Catalog | `/catalog` | components, component-categories |
| PanelBuilder | `/panel-builder` | catalog, templates, regions, configurations, rails, circuits, placements, pricing |
| BuilderIntegration | `/panel-builder/integration` | submit-to-quote, submit-for-review |
| Configurations | `/configurations` | create, list, submit-for-review |
| Quotes | `/quotes` | create, calculate, send, customer-approve, reopen |
| BOM | `/bom` | versions |
| Orders | `/orders` | convert, advance |
| Shipments | `/shipments` | full lifecycle |
| Pricing | `/pricing` | context resolution |
| Platform | `/plans`, `/subscriptions`, `/billing` | Stripe integration |
| ERP | `/erp` | sales, inventory, procurement, fiscal, financial |
| SuperAdmin | `/super-admin` | stats, tenants, users |
| Privacy (LGPD) | `/privacy` | config, consents, data-requests, export, delete, audit |

---

## Frontend Routes

| Rota | Componente | Proteção |
|------|-----------|----------|
| `/login` | LoginPage | Público |
| `/configure` | BuilderWizard | Autenticado |
| `/configure/[id]` | BuilderWizard | Autenticado |
| `/admin` | SuperAdminDashboard | Super Admin |
| `/api/auth/[...nextauth]` | NextAuth handler | Público |

---

## Fluxo de Builder (Frontend)

```
Step 1: Projeto → tipo, tensão, fases, ambiente
Step 2: Invólucro → seleção visual de enclosure
Step 3: Circuitos → definição de circuitos elétricos
Step 4: Componentes → catálogo + layout DIN rail
Step 5: Revisão → 3D preview + BOM + pricing
[ ] Botão "Gerar Quote" → integração pendente
```

---

## Pesquisa de Mercado (docs/research/)

| Documento | Conteúdo |
|-----------|----------|
| `panel-builder-research.md` | 8 etapas montagem, normas (NR-10, NBR 5410, IEC 61439), competidores |
| `electrical-market-brazil.md` | 1472 linhas: componentes reais, preços BRL, tensão por estado, clima |

---

## Seed Data

- **11 regiões** brasileiras (tensão/clima/IP por estado)
- **8 panel templates** (CCM, QGBT, Automação, VFD, etc.)
- **84 componentes universais** genéricos (reutilizáveis por marca)
- **10 business rules** (clearance, IP, sizing, pricing, thermal)
- **2 tenants** de demonstração
- **4 usuários** + Super Admin

---

## LGPD (Lei 13.709/2018)

### Backend (implementado)
- `TenantPrivacyConfig` — DPO, política, retenção
- `ConsentRecord` — consentimento por finalidade (Art. 7, 8)
- `DataSubjectRequest` — requisições do titular (Art. 18)
- `PrivacyAuditLog` — auditoria de acesso
- Exportação de dados (portabilidade Art. 18, V)
- Anonimização/exclusão (Art. 15, 16)

### Frontend (pendente)
- [ ] Consent banner (cookies)
- [ ] Privacy settings page
- [ ] Data subject request form

---

## Próximos Passos (Roadmap)

### Fase B — Builder + API Integration
- [ ] Consumir `GET /panel-builder/catalog` (catálogo real)
- [ ] Consumir `GET /panel-builder/regions` (dados por estado)
- [ ] Consumir `GET /panel-builder/templates` (templates prontos)
- [ ] Salvar configuração via `POST /panel-builder/configurations`
- [ ] Calcular pricing via `GET /panel-builder/configurations/:id/pricing`

### Fase C — LGPD Frontend
- [ ] Consent banner component
- [ ] Privacy settings page (`/privacy`)
- [ ] Data subject request form
- [ ] Cookie consent granular

### Fase D — Super Admin Funcional
- [ ] Conectar dashboard a `GET /super-admin/stats`
- [ ] Tabela de tenants com dados reais
- [ ] Criar/desativar tenants
- [ ] Buscar e gerenciar usuários

### Fase E — Polish
- [ ] Toast notifications (Sonner)
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Empty states
- [ ] E2E tests (Playwright)

---

## Comandos Úteis

```bash
# Desenvolvimento
pnpm run dev              # Inicia tudo (turbo)
pnpm run build            # Build completo
pnpm run typecheck        # Typecheck completo
pnpm run lint             # Lint

# Backend (apps/api)
cd apps/api
npx prisma migrate dev    # Criar/aplicar migration
npx prisma generate       # Gerar Prisma Client
npx prisma db push        # Sync schema (dev)
npx prisma studio         # GUI do banco
npx ts-node --project tsconfig.seed.json prisma/seed.ts  # Popular dados

# Testes
DATABASE_URL='postgresql://cpq:cpq@localhost:5432/cpq' npx jest

# Frontend (apps/web)
cd apps/web
npx next dev -p 3001      # Dev server
npx next build            # Production build
npx tsc --noEmit          # Typecheck
```

---

## Variáveis de Ambiente

### Backend (apps/api/.env)
```
DATABASE_URL=postgresql://cpq:cpq@localhost:5432/cpq
JWT_ACCESS_SECRET=<gerar>
JWT_REFRESH_SECRET=<gerar>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLATFORM_DOMAIN=localhost:3000
```

### Frontend (apps/web/.env.local)
```
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=<gerar com openssl rand -base64 32>
API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=CPQ Painéis
```

---

## Skills Utilizadas neste Projeto

| Skill | Aplicação |
|-------|-----------|
| `frontend-design` | Identidade visual, tipografia, 3-color rule |
| `apple-design` | Springs, press feedback, interruptibilidade |
| `emil-design-eng` | Animation decision framework |
| `animation-vocabulary` | Glossário de motion |
| `viral-product-principles` | 32 princípios de conversão |
| `revenue-centric-design` | Value first, single CTA, defaults |
| `codebase-design` | Deep modules, seams, interfaces |
| `tdd` | Red-green loop, vertical slices |
| `webapp-testing` | Playwright E2E |
| `domain-modeling` | Glossário ubíquo, ADRs |
| `implement` | TDD implementation pattern |

---

## Notas Importantes

1. **Multi-tenant**: Todo dado é isolado por `tenantId`. O interceptor global garante escopo.
2. **Componentes genéricos**: Os 84 componentes são visuais universais. O cliente cadastra marca/preço por cima.
3. **SVGs**: 18 ícones em `public/components/` — ainda não integrados no frontend.
4. **LGPD**: Backend completo, frontend pendente (banner + privacy page).
5. **Composio**: Firecrawl conectado para web scraping de preços (confirmar antes de usar).
6. **Stripe**: Billing module implementado mas não testado em produção.

---

*Documento gerado em Julho 2026 — Projeto em desenvolvimento ativo.*
