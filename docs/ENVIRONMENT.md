# Documentação Completa do Ambiente de Desenvolvimento

> Última atualização: 2026-07-22

---

## 1. Infraestrutura

### 1.1 Sistema Operacional
- **Host**: Windows 11
- **WSL**: Ubuntu 22.04 LTS
- **Docker Desktop**: v29.6.2 (integrado com WSL2)
- **Docker Compose**: v5.3.1

### 1.2 Node.js (WSL)
- **Versão**: v20.20.2 (instalado via nvm)
- **Gerenciador de pacotes**: pnpm v9.15.9
- **Diretório do projeto**: `/home/thalis/Sistema`

### 1.3 Banco de Dados
- **PostgreSQL**: v16-alpine
- **Redis**: v7-alpine
- **Prisma ORM**: v5.22.0
- **RLS**: Row-Level Security habilitado

### 1.4 Containers Docker

| Serviço | Imagem | Porta Host | Porta Container | Status |
|---------|--------|------------|-----------------|--------|
| API | sistema-api (custom) | 3000 | 3000 | ✅ Healthy |
| Web | sistema-web (custom) | 3001 | 3001 | ✅ Healthy |
| PostgreSQL | postgres:16-alpine | 5432 | 5432 | ✅ Healthy |
| Redis | redis:7-alpine | 6379 | 6379 | ✅ Healthy |
| nginx | nginx:alpine | 80 | 80 | ✅ Running |

### 1.5 Repositório Git
- **URL**: https://github.com/EosBot/cpq-paineis-eletricos.git
- **Branch**: master
- **Commits**: 5 (até 2026-07-22)

---

## 2. Ferramentas Composio (Ativas)

### 2.1 Firecrawl (Web Scraping)
- **Status**: ✅ Ativo
- **Créditos**: 1025 restantes (plano de 1000/mês)
- **Billing**: 2026-07-21 a 2026-08-21
- **Capacidades**:
  - `FIRECRAWL_SCRAPE` — Scrape de página individual
  - `FIRECRAWL_SEARCH` — Busca web com scraping
  - `FIRECRAWL_CRAWL_V2` — Crawl de sites inteiros
  - `FIRECRAWL_BATCH_SCRAPE` — Scrape em lote

### 2.2 Browser Tool (Browserbase)
- **Status**: ✅ Ativo
- **Sem autenticação necessária**
- **Capacidades**:
  - `BROWSER_TOOL_CREATE_TASK` — Automação de browser com IA
  - `BROWSER_TOOL_GET_SESSION` — Ver sessão ao vivo
  - `BROWSER_TOOL_WATCH_TASK` — Monitorar tarefa

### 2.3 Docker Hub
- **Status**: ✅ Ativo (requer interação para criação de repo)
- **Capacidades**:
  - `DOCKER_HUB_CREATE_REPOSITORY` — Criar repo público/privado
  - `DOCKER_HUB_LIST_REPOSITORIES` — Listar repos
  - `DOCKER_HUB_CREATE_WEBHOOK` — Criar webhooks
  - `DOCKER_HUB_GET_REPOSITORY` — Detalhes do repo

---

## 3. Stack Tecnológico

### 3.1 Backend (NestJS 10)
- **Framework**: NestJS 10.4.2
- **ORM**: Prisma 5.22.0
- **Validação**: class-validator + class-transformer
- **Auth**: Passport JWT + NextAuth v5 (frontend)
- **Documentação**: Swagger/OpenAPI (@nestjs/swagger)
- **Segurança**: Helmet, CORS, Rate Limiting (Throttler)

### 3.2 Frontend (Next.js 15)
- **Framework**: Next.js 15.5.20 (App Router)
- **UI**: Tailwind CSS + shadcn/ui + Radix
- **State**: Zustand (local) + React Query (server)
- **3D**: React Three Fiber + @react-three/drei
- **Animações**: Framer Motion
- **Ícones**: Lucide React

### 3.3 Monorepo
- **Workspaces**: pnpm workspace
- **Orquestração**: Turborepo
- **Apps**: api, web
- **Packages**: (placeholders) ui, config, shared

---

## 4. Módulos Backend Implementados

| Módulo | Descrição | Endpoints |
|--------|-----------|-----------|
| Auth | JWT + Refresh tokens | /auth/login, /auth/refresh, /auth/validate |
| Audit | Log de auditoria | /audit-logs |
| Catalog | Componentes + Categorias | /catalog/components, /catalog/component-categories |
| Configurations | Configurações de painéis | /configurations |
| Quotes | Orçamentos CPQ | /quotes |
| Orders | Pedidos | /orders |
| Shipments | Envios | /shipments |
| BOM | Lista de materiais | /bom/versions |
| Pricing | Precificação | /pricing |
| Rules | Regras de negócio | /rules |
| PanelBuilder | Builder de painéis | /panel-builder/* |
| BuilderIntegration | Integração builder→quote | /panel-builder/integration/* |
| Platform/Plan | Planos de assinatura | /plans |
| Platform/Subscription | Assinaturas | /subscriptions |
| Platform/Billing | Faturamento Stripe | /billing |
| Platform/Tenant | Gestão de tenants | /tenant |
| Platform/I18n | Internacionalização | /i18n |
| Platform/Feature | Feature flags | /features |
| ERP/Fiscal | NF-e, NFC-e | /erp/fiscal/* |
| ERP/Inventory | Estoque | /erp/inventory/* |
| ERP/Sales | Vendas | /erp/sales/* |
| ERP/Procurement | Compras | /erp/procurement/* |
| ERP/Financial | Financeiro | /erp/financial/* |
| Privacy | LGPD | /privacy/* |
| SuperAdmin | Admin da plataforma | /super-admin/* |
| Marketplace | Produtos, Carrinho, Pedidos, Clientes | /products, /categories, /cart, /customers, /orders |

---

## 5. Dados de Mercado Brasileiro

### 5.1 Fabricantes Presentes no Brasil

| Fabricante | Origem | Especialidade |
|-----------|--------|---------------|
| WEG | 🇧🇷 Brasileira | VFDs, motores, transformadores, MCCBs |
| ABB | 🇸🇪 Suíça | VFDs, contatores, disjuntores, PLCs |
| Schneider | 🇫🇷 Francesa | Disjuntores, contatores, PLCs, HMIs |
| Siemens | 🇩🇪 Alemã | PLCs, HMIs, VFDs, disjuntores |
| Eaton | 🇮🇪 Irlandesa | MCCBs, UPS, distribuição |
| Steck | 🇧🇷 Brasileira | MCBs, distribuição (low-cost) |
| Elgin | 🇧🇷 Brasileira | MCBs, distribuição (low-cost) |
| Soprano | 🇧🇷 Brasileira | Contatores, mini-contatores |
| Rockwell | 🇺🇸 EUA | PLCs, HMIs (automotive) |
| Finder | 🇮🇹 Itália | Relés |
| Omron | 🇯🇵 Japão | Relés, sensores, automação |
| Phoenix Contact | 🇩🇪 Alemanha | Terminais, fontes, relés |
| Weidmüller | 🇩🇪 Alemanha | Terminais, relés, invólucros |
| Wago | 🇩🇪 Alemanha | Terminais, PLCs |
| Mean Well | 🇹🇼 Taiwan | Fontes (econômicas) |
| Finder | 🇮🇹 Itália | Relés |

### 5.2 Normas Técnicas Aplicáveis

| Norma | Descrição | Aplicação |
|-------|-----------|-----------|
| NR-10 | Segurança em instalações elétricas | Obrigatória para todo trabalho elétrico |
| NBR 5410 | Instalações elétricas de baixa tensão | Edifícios, distribuição |
| IEC 61439-1/2 | Conjuntos de manobra e controle | Fabricação de painéis |
| NR-12 | Segurança em máquinas | Painéis integrados a máquinas |
| NBR IEC 60947 | Dispositivos de manobra e proteção | Seleção de componentes |
| ANEEL 482/2012 | Geração distribuída | Painéis solares |
| PRODIST | Procedimentos de distribuição | Conexão à rede |

### 5.3 Tipos de Painéis (Mercado Brasileiro)

| Tipo | Descrição | Componentes Típicos | Faixa de Preço (BRL) |
|------|-----------|---------------------|---------------------|
| CCM | Centro de Controle de Motores | Contatores, relés, MCCBs, VFDs | R$15.000–70.000 |
| QGBT | Quadro Geral de Baixa Tensão | ACB, MCCBs, barramentos, medidores | R$25.000–50.000 |
| CTA | Centro de Transformação e Automação | Disjuntores, PLCs, VFDs, HMI | R$20.000–60.000 |
| Painel de Comando | Controle de máquinas | Fonte 24V, CLP, relés, bornes | R$5.000–40.000 |
| Painel de Automação | CLP + HMI + I/O | CLP, HMI, I/O, fontes, comunicação | R$15.000–50.000 |
| CCMI | CCM com Inversores | VFDs, filtros, PLCs, bypass | R$50.000–80.000 |
| Distribuição | Quadro de distribuição | MCBs, disjuntores, terminais | R$3.000–18.000 |
| Solar CC | Proteção CC fotovoltaica | Fusíveis DC, SPD, desconexão | R$1.500–4.000 |
| Solar CA | Proteção CA (QGD) | SPD, desconexão, medição | R$2.000–5.000 |

### 5.4 Variações Regionais

| Região | Estados | Tensão | Clima | IP Mín. |
|--------|---------|--------|-------|---------|
| Sudeste | SP, RJ, MG, ES | 380V | Subtropical | IP41 |
| Sul | PR, SC, RS | 380V | Subtropical/Frio | IP41 |
| Nordeste | AL, BA, CE, MA, PB, PE, PI, RN, SE | 380V/220V | Quente/Semi-árido | IP54 |
| Norte | AC, AM, AP, PA, RO, RR, TO | 220V/380V | Úmido equatorial | IP55 |
| Centro-Oeste | DF, GO, MT, MS | 380V | Tropical | IP41 |

---

## 6. Configuração de Desenvolvimento

### 6.1 Variáveis de Ambiente

**Backend (apps/api/.env)**:
```
DATABASE_URL=postgresql://cpq:cpq@localhost:5432/cpq
JWT_ACCESS_SECRET=<gerar>
JWT_REFRESH_SECRET=<gerar>
PORT=3000
CORS_ORIGIN=http://localhost
REDIS_URL=redis://localhost:6379
```

**Frontend (apps/web/.env.local)**:
```
NEXTAUTH_URL=http://localhost
NEXTAUTH_SECRET=<gerar>
API_BASE_URL=http://localhost:3000/api/v1
INTERNAL_API_URL=http://api:3000/api/v1
NEXT_PUBLIC_APP_NAME=CPQ Marketplace
```

### 6.2 Comandos de Desenvolvimento

```bash
# Iniciar tudo (Docker)
docker compose up -d

# Instalar dependências
pnpm install

# Gerar Prisma Client
cd apps/api && npx prisma generate

# Aplicar migrations
cd apps/api && npx prisma migrate dev

# Typecheck
cd apps/api && pnpm run typecheck
cd apps/web && pnpm run typecheck

# Testes
cd apps/api && pnpm run test

# Build
pnpm run build

# Dev (turbo)
pnpm run dev
```

---

## 7. Projetos Relacionados

### 7.1 Pesquisa de Mercado (docs/research/)

| Arquivo | Conteúdo |
|---------|----------|
| `electrical-market-brazil.md` | Pesquisa completa: componentes, preços, normas, regras |
| `marketplace-patterns.md` | Padrões de marketplace (Shopify, VTEX, etc.) |
| `financial-management-reference.md` | Gestão financeira para painéis |
| `fiscal-documents-reference.md` | Documentos fiscais (NF-e, NFC-e) |

### 7.2 Arquitetura (docs/adr/)

| ADR | Título |
|-----|--------|
| 0001 | Multi-Tenant Marketplace Isolation |
| 0002 | Storefront Pública |
| 0003 | Product Catalog |
| 0004 | Cart & Checkout |
| 0005 | Order Lifecycle |
| 0006 | Seller ERP |
| 0007 | CPQ Module Within Marketplace |
| 0008 | Admin Platform |
| 0009 | Concurrency & Consistency |
| 0010 | Security Architecture |
| 0011 | API Design (REST) |
| 0012 | Frontend Architecture (Three Apps) |
| 0013 | DevOps & Infrastructure |

---

## 8. Docker Hub

- **Usuário**: eosbot (conectado via Composio)
- **Repositório**: pendente de criação (requer autenticação interativa)
- **Tipo**: privado ou público (a definir)
- **Imagens**: sistema-api, sistema-web

---

## 9. Segurança

### 9.1 Implementado
- JWT com access (15min) + refresh (7d) tokens
- Row-Level Security (RLS) no PostgreSQL
- Tenant isolation via JWT + middleware
- RBAC (Roles: admin, engineer, sales, viewer)
- Helmet (headers de segurança)
- CORS configurável
- Rate limiting (20 req/min)
- argon2 para hash de senhas
- class-validator para inputs

### 9.2 Pendente
- MFA (Multi-Factor Auth)
- IP allowlisting para admin
- WAF (Web Application Firewall)
- Secrets rotation
- HTTPS obrigatório em produção

---

## 10. Roadmap

### ✅ Completo
- [x] Multi-tenant isolation
- [x] Auth system (JWT + NextAuth)
- [x] Docker development environment
- [x] API modules (auth, catalog, orders, etc.)
- [x] Security fixes
- [x] Marketplace foundation (products, cart, orders)

### 🚧 Em Progresso
- [ ] Panel Builder com normas brasileiras
- [ ] UI/UX redesign com animações
- [ ] Integração CPQ → Marketplace

### 📋 Planejado
- [ ] Seller ERP panel
- [ ] Admin platform
- [ ] Payment gateway integration
- [ ] E2E tests
- [ ] CI/CD pipeline
- [ ] VPS deployment
- [ ] Docker Hub images

---

*Documento gerado automaticamente em 2026-07-22.*
