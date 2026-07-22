# Architecture Reference — Principal/Staff Level

> **Objetivo**: Documento de referência obrigatório para engenheiros de nível Principal/Staff. Cada seção contém os conceitos fundamentais, decisões de arquitetura aplicadas ao projeto CPQ Painéis Elétricos, e referências cruzadas aos ADRs e código.

---

## 1. Consistência e Concorrência

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Idempotência** | Operação pode ser repetida sem alterar o resultado além da primeira aplicação. | Header `Idempotency-Key` obrigatório em `POST /quotes`, `/configurations`, `/orders`, `/bom/versions`. Chave armazenada com TTL 24h. |
| **Race Conditions** | Múltiplas threads/processos acessam dado compartilhado sem sincronização adequada. | Prevenido via **optimistic locking** (`@@version` Prisma) + **pessimistic locking** (`SELECT FOR UPDATE`) em pontos críticos. |
| **Deadlocks** | Ciclo de espera circular por locks. | Ordem consistente de aquisição de locks (sempre `tenantId` → `quoteId` → `orderId`). Timeout de lock 5s. |
| **Livelocks** | Processos mudam estado mas não progridem. | Backoff exponencial + jitter em retries; circuit breaker evita livelock em cascata. |
| **Starvation** | Processo nunca obtém recurso. | Fair queuing no connection pool; prioridade por tenant isolado. |
| **Optimistic Locking** | Verifica versão antes de commit; falha se versão mudou. | Campo `version` (`@@version` Prisma) em `QuoteVersion`, `ConfigurationSnapshot`, `RuleVersion`, `BomVersion`, `Order`, `Shipment`. |
| **Pessimistic Locking** | `SELECT FOR UPDATE` bloqueia linhas até commit. | Usado em `advanceOrder`, `approveRuleVersion`, `calculateQuoteVersion` via `prisma.$transaction` com `lock: { mode: 'update' }`. |
| **MVCC** | Multi-Version Concurrency Control — leitores não bloqueiam escritores. | PostgreSQL padrão; `READ COMMITTED` isolamento. |
| **Isolation Levels** | `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`. | Projeto usa `READ COMMITTED` (padrão Postgres). `REPEATABLE READ` apenas em relatórios analíticos. |
| **Atomicidade** | Transação: tudo ou nada. | `prisma.$transaction` garante atomicidade em fluxos multi-entidade. |
| **Consistência** | Dados válidos antes e depois da transação. | Constraints DB + validação domínio + tenant isolation. |
| **Durabilidade** | Commit persiste após falha. | PostgreSQL WAL + `fsync=on`; backups diários. |
| **Transações** | Unidade de trabalho ACID. | Transações curtas (<100ms); evita transações distribuídas. |
| **Rollback** | Desfaz transação em erro. | Automático em exceção dentro de `$transaction`. |
| **Compensating Transactions** | Operação inversa para desfazer efeito de passo anterior em saga. | Implementado via **Outbox Pattern** + handlers de compensação (ex: `cancelOrder` → `releaseInventory`). |
| **Saga Pattern** | Sequência de transações locais com compensação. | Coreografia via eventos de domínio (`OrderCreated`, `QuoteApproved`) + Outbox. |
| **Eventual Consistency** | Estado converge assincronamente. | Notificações, webhooks, sincronização ERP — aceita latência <5s. |
| **Strong Consistency** | Leitura vê escrita imediatamente. | Fluxo crítico: quote → order → shipment — transação única. |
| **Read Your Writes** | Cliente vê própria escrita. | Garantido por transação síncrona + cache invalidation por tenant. |
| **Monotonic Reads** | Leituras não regredem no tempo. | Session affinity + cache versionado. |
| **Write Skew** | Duas transações leem mesmo estado, escrevem decisões conflitantes. | Prevenido por `SELECT FOR UPDATE` em decisões de estado (aprovar, avançar). |
| **Lost Update** | Escrita sobrescreve outra sem ler valor novo. | Optimistic locking (`version`) detecta e falha. |
| **Dirty Read** | Lê dado não commitado. | Impossível em `READ COMMITTED`. |
| **Phantom Read** | Nova linha aparece em re-leitura. | Aceitável em listagens; crítico em contagens → `SELECT FOR UPDATE` + `COUNT(*)`. |
| **Non-repeatable Read** | Mesma linha lida duas vezes com valores diferentes. | Aceitável; versão otimista protege escritas. |

### Decisões de Arquitetura (ADRs)
- **ADR-0007**: Concurrency & Consistency Strategy
- **ADR-0001**: Tenant Boundary and Isolation (row-level `tenantId`)

### Código Relacionado
- `apps/api/src/tenancy/prisma-tenant-scope.ts` — middleware de isolamento
- `apps/api/src/quotes/quotes.service.ts` — `calculateQuoteVersion` com locking
- `apps/api/src/orders/orders.service.ts` — `advanceOrder` com `SELECT FOR UPDATE`
- `apps/api/src/rules/rules.service.ts` — `approveRuleVersion` com locking
- `apps/api/src/common/interceptors/idempotency.interceptor.ts` — interceptor de idempotência

---

## 2. Sistemas Distribuídos

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **CAP Theorem** | Consistency, Availability, Partition Tolerance — escolha 2. | CP para fluxo crítico (quote→order); AP para notificações/webhooks. |
| **PACELC** | Extensão do CAP: se particionado (P) → A vs C; senão (E) → Latency vs Consistency. | Latência baixa priorizada em leituras (cache); consistência forte em escritas. |
| **Consensus** | Acordo entre nós distribuídos. | Não aplicável (monolito modular); futuro: Raft para configuração distribuída. |
| **Raft** | Algoritmo de consenso compreensível. | Referência para future leader election em feature flags. |
| **Paxos** | Consenso clássico. | Referência teórica. |
| **Leader Election** | Escolha de coordenador. | Kubernetes leader election para jobs agendados (migrações, relatórios). |
| **Quorum** | Maioria necessária para decisão. | Não aplicável (single-primary Postgres). |
| **Split Brain** | Dois primários ativos. | Prevenido por `pg_rewind` + `repmgr` failover automático. |
| **Distributed Lock** | Lock cross-node. | Redis Redlock para idempotency keys cross-instance. |
| **Distributed Transactions** | Transação cross-service. | Evitado; usa **Saga + Outbox** em vez de 2PC. |
| **Clock Drift** | Desvio de relógios. | NTP sincronizado; timestamps UTC; `clock_timestamp()` no DB. |
| **Vector Clock** | Ordenação causal de eventos. | Não usado; eventos têm `timestamp` + `sequence` por agregado. |
| **Lamport Clock** | Relógio lógico para ordenação. | Não usado. |
| **Event Ordering** | Garantia de ordem de eventos. | Kafka/Outbox garante ordem por `aggregateId` (partition key). |
| **Causal Consistency** | Se A causa B, todos veem A antes de B. | Garantido por single-writer por agregado + versionamento. |

### Decisões de Arquitetura
- **ADR-0003**: Configuration and Rule Engine (event-driven rules)
- **ADR-0005**: BOM Versioning and Order Handoff (eventual consistency para ERP sync)

### Código Relacionado
- `apps/api/src/common/events/outbox.ts` — Outbox pattern
- `apps/api/src/common/events/event-bus.ts` — Event bus in-memory (dev) / Kafka (prod)
- `apps/api/src/orders/orders.service.ts` — Saga: `convertQuoteToOrder` → emite `OrderCreated`

---

## 3. APIs

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **REST** | Arquitetura baseada em recursos, verbos HTTP, stateless. | API principal: `/api/v1/*` — recursos: `quotes`, `orders`, `configurations`, `bom`, `catalog`, `rules`, `shipments`. |
| **GraphQL** | Query language para APIs flexíveis. | Não usado; REST + OpenAPI suficiente. Futuro: GraphQL para dashboard analítico. |
| **gRPC** | RPC de alta performance com protobuf. | Não usado; comunicação interna via function calls (monolito). Futuro: gRPC para microserviços. |
| **HATEOAS** | Hypermedia as Engine of Application State. | Links de navegação em respostas (`_links: { next, prev, self }`). |
| **OpenAPI** | Specificação de API. | Gerado via `@nestjs/swagger` → `/api/docs` (Swagger UI) + `openapi.yaml`. |
| **Versionamento** | Estratégia de evolução da API. | URL versioning: `/api/v1/`; headers `Accept: application/vnd.cpq.v1+json`. |
| **Backward Compatibility** | Novas versões não quebram clientes antigos. | Aditivo apenas: novos campos opcionais, novos endpoints, nunca remove/renomeia. |
| **Forward Compatibility** | Clientes antigos ignoram campos novos. | JSON ignora campos desconhecidos; validação `additionalProperties: false` apenas em input. |
| **Pagination** | Divisão de resultados grandes. | Cursor pagination (`after`, `first`) para listas infinitas; offset para relatórios. |
| **Cursor Pagination** | Paginação baseada em cursor opaco. | `QuoteVersionConnection { edges { cursor node } pageInfo { hasNextPage endCursor } }`. |
| **Offset Pagination** | `page`, `limit` / `offset`, `limit`. | Usado em relatórios administrativos. |
| **Filtering** | Filtros dinâmicos. | Query params: `?status=APPROVED&customerId=...`; validação via `class-validator`. |
| **Sorting** | Ordenação. | `?sort=createdAt:desc,versionNumber:asc`; whitelist de campos. |
| **Partial Update** | Atualização de subconjunto de campos. | `PATCH` com `Partial<T>` DTO; `PUT` = substituição completa. |
| **PATCH vs PUT** | `PATCH` = parcial; `PUT` = substituição total. | `PATCH /quotes/{id}` para status; `PUT /catalog/components/{id}` para substituição. |
| **Idempotent Methods** | `GET`, `HEAD`, `PUT`, `DELETE`, `OPTIONS`, `TRACE` são idempotentes. | `POST` com `Idempotency-Key` para criar recursos idempotentemente. |
| **Retry Policy** | Estratégia de retentativa. | Cliente: exponential backoff + jitter (max 3 retries); Server: `Retry-After` em 429/503. |
| **Retry-After** | Header indicando quando repetir. | Retornado em rate limit (429) e manutenção (503). |
| **Correlation ID** | ID que atravessa toda a cadeia de chamadas. | Header `X-Correlation-ID` (UUID v4); propagado em logs, traces, eventos. |
| **Request ID** | ID único por request. | `X-Request-ID` gerado no gateway; incluído em todos os logs. |
| **ETag** | Entity tag para validação condicional. | `ETag: W/"<version>"` em `GET /quotes/{id}/versions/{v}`; suporta `If-None-Match`. |
| **Conditional Requests** | `If-Match`, `If-None-Match`, `If-Modified-Since`. | Suportado em `GET` de versões; `If-Match` em `PATCH` para optimistic locking. |
| **Cache-Control** | Diretivas de cache HTTP. | `Cache-Control: private, max-age=60` para dados de tenant; `no-store` para auth. |

### Decisões de Arquitetura
- **ADR-0006**: First Vertical API Surface (define recursos, versionamento, headers obrigatórios)

### Código Relacionado
- `apps/api/src/main.ts` — global prefix, validation pipe, Swagger setup
- `apps/api/src/common/interceptors/correlation-id.interceptor.ts`
- `apps/api/src/common/guards/tenant-guard.ts` — headers `x-tenant-id`, `x-user-id`
- `apps/api/src/common/decorators/idempotency-key.decorator.ts`

---

## 4. Resiliência

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Retry** | Repetir operação falha. | `@Retryable` em clients HTTP (ERP, email); max 3, backoff exponencial. |
| **Exponential Backoff** | Atraso cresce exponencialmente. | `delay = base * 2^attempt + jitter`; base=100ms, max=5s. |
| **Jitter** | Aleatoriedade no backoff. | `Math.random() * delay * 0.3` previne thundering herd. |
| **Circuit Breaker** | Falha rápida após threshold de erros. | `opossum` circuit breaker em clients externos (ERP, email, storage). States: closed → open → half-open. |
| **Bulkhead** | Isolamento de recursos. | Connection pools separados por serviço externo; thread pool dedicado para jobs pesados (BOM generation). |
| **Timeout** | Limite de tempo para operação. | HTTP client: 10s connect, 30s read; DB query: 5s; gRPC: 15s. |
| **Cancellation** | Cancelar operação em andamento. | `AbortController` em fetch; `CancellationToken` em jobs longos. |
| **Hedging** | Enviar request duplicado para réplica mais rápida. | Não implementado; baixa latência interna torna desnecessário. |
| **Fail Fast** | Falhar imediatamente se pré-condição não atendida. | Validação de entrada no pipe; tenant isolation check antes de query. |
| **Graceful Degradation** | Funcionalidade reduzida em vez de falha total. | Cache stale-while-revalidate; fallback para configuração default se rules engine falhar. |
| **Fallback** | Valor/ação alternativa em falha. | `pricingService.resolvePricingContext` → fallback para preço base se regras falharem. |
| **Health Checks** | Verificação de saúde do serviço. | `/healthz` (liveness), `/ready` (readiness) — verificam DB, Redis, external deps. |
| **Readiness** | Pronto para receber tráfego. | `/ready` verifica migrações aplicadas, conexão DB, cache warm. |
| **Liveness** | Processo vivo. | `/healthz` — apenas processo ativo; k8s reinicia se falhar. |
| **Startup Probe** | Verificação durante inicialização. | `/startup` — aguarda migrações + seed + cache warm (até 60s). |

### Decisões de Arquitetura
- **ADR-0004**: Commercial Pricing and Quote Lifecycle (fallback pricing)
- **ADR-0003**: Configuration and Rule Engine (circuit breaker em rules evaluation)

### Código Relacionado
- `apps/api/src/common/resilience/circuit-breaker.ts` — wrapper `opossum`
- `apps/api/src/common/resilience/retry.ts` — decorator `@Retryable`
- `apps/api/src/common/health/health.controller.ts` — endpoints de health
- `apps/api/src/pricing/pricing.service.ts` — fallback pricing

---

## 5. Arquitetura

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Clean Architecture** | Camadas: Entities → Use Cases → Interface Adapters → Frameworks. | `domain/` (entities, value objects), `application/` (services, dtos), `infrastructure/` (prisma, http, email), `presentation/` (controllers). |
| **Hexagonal (Ports & Adapters)** | Core isolado via portas; adaptadores plugáveis. | `PrismaService` implementa `IRepository` ports; `EmailService` implementa `INotificationPort`. |
| **Onion Architecture** | Camadas concêntricas; dependências apontam para centro. | Similar a Clean; domínio no centro, infra nas bordas. |
| **Vertical Slice** | Feature completa vertical (API → DB) em vez de camadas horizontais. | Cada módulo NestJS (`quotes`, `orders`, `catalog`, `rules`, `bom`, `shipments`) é um vertical slice. |
| **Modular Monolith** | Monolito com módulos isolados, baixo acoplamento. | pnpm workspace + NestJS modules; `packages/shared` para contratos; migração futura para microserviços via extração de módulos. |
| **Microservices** | Serviços independentes deployáveis. | Não agora; preparado para extração (bounded contexts claros). |
| **Event Driven** | Comunicação assíncrona via eventos. | Domain events → Outbox → Kafka; handlers assíncronos para notificações, ERP sync. |
| **CQRS** | Command Query Responsibility Segregation. | Parcial: `Command` (mutations) vs `Query` (read models) em services; futuro: read replicas dedicadas. |
| **Event Sourcing** | Estado como sequência de eventos. | Não usado; state-based com versionamento. Auditoria via `AuditLog` table. |
| **DDD** | Domain-Driven Design. | Aggregates: `Quote`, `Order`, `Configuration`, `Rule`, `Bom`. Value Objects: `Money`, `Quantity`, `TenantId`. Domain Events: `QuoteApproved`, `OrderCreated`. |
| **SOLID** | 5 princípios OO. | Aplicado: SRP (services pequenos), OCP (strategy para pricing), LSP (repository interfaces), ISP (ports granulares), DIP (dependência de abstrações). |
| **GRASP** | General Responsibility Assignment Software Patterns. | Controller → Service → Repository; Information Expert; Low Coupling; High Cohesion. |
| **KISS** | Keep It Simple, Stupid. | Evita over-engineering; transações simples; sem event sourcing prematuro. |
| **DRY** | Don't Repeat Yourself. | `packages/shared` para DTOs, enums, types; `applyTenantScope` middleware. |
| **YAGNI** | You Aren't Gonna Need It. | Não implementa GraphQL, Event Sourcing, Kubernetes até necessidade real. |
| **Separation of Concerns** | Responsabilidades distintas. | Camadas claras; módulos por bounded context. |
| **High Cohesion** | Módulo faz uma coisa bem. | Cada NestJS module = um bounded context. |
| **Low Coupling** | Módulos independentes. | Comunicação via events; interfaces (ports) entre camadas. |

### Decisões de Arquitetura
- **ADR-0001**: Tenant Boundary and Isolation
- **ADR-0002**: Component Catalog Model
- **ADR-0003**: Configuration and Rule Engine
- **ADR-0004**: Commercial Pricing and Quote Lifecycle
- **ADR-0005**: BOM Versioning and Order Handoff
- **ADR-0006**: First Vertical API Surface
- **ADR-0007**: Concurrency & Consistency Strategy

### Código Relacionado
- `apps/api/src/` — estrutura modular por domínio
- `packages/shared/` — contratos compartilhados
- `packages/types/` — tipos TypeScript puros
- `packages/config/` — configuração centralizada

---

## 6. Segurança

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Least Privilege** | Mínimos privilégios necessários. | Roles: `admin`, `engineer`, `sales`, `viewer`; permissions por recurso. |
| **Defense in Depth** | Camadas de defesa. | WAF (Cloudflare) → API Gateway → Auth Guard → Tenant Guard → RBAC Guard → Validation Pipe. |
| **Zero Trust** | Não confiar implicitamente. | mTLS interno; verificação de token em cada request; tenant isolation em DB. |
| **RBAC** | Role-Based Access Control. | `@Roles('admin', 'engineer')` decorator; `RolesGuard` valida `user.role`. |
| **ABAC** | Attribute-Based Access Control. | Futuro: policies baseadas em `tenant.plan`, `user.department`, `resource.owner`. |
| **OAuth2** | Framework de autorização. | Não usado (auth interno JWT); futuro: OAuth2 para integrações parceiros. |
| **OIDC** | OpenID Connect sobre OAuth2. | Não usado; futuro: SSO enterprise. |
| **JWT** | JSON Web Tokens. | Access token (15min) + Refresh token (7d, rotation, revocation list). `argon2` para hash de senha. |
| **Refresh Tokens** | Token de longa duração para renovar access. | Armazenado hash no DB; rotação a cada uso; revogação em logout/suspensão. |
| **MFA** | Multi-Factor Authentication. | Não implementado; roadmap Q3. |
| **OWASP Top 10** | Top 10 vulnerabilidades web. | Mitigado: A01 (broken access) → tenant guard; A02 (crypto) → argon2, TLS; A03 (injection) → Prisma parameterized; A04 (insecure design) → threat modeling; A05 (misconfig) → helm values + secrets; A06 (vuln components) → dependabot; A07 (auth) → JWT + rotation; A08 (integrity) → SBOM; A09 (logging) → structured logs; A10 (SSRF) → allowlist URLs. |
| **OWASP API Security** | Top 10 API. | Mitigado: API1 (broken object) → tenant scope; API2 (broken auth) → JWT; API3 (excessive data) → DTOs; API4 (rate limit) → throttle; API5 (broken function) → RBAC; API6 (mass assignment) → `class-transformer` + `whitelist`; API7 (security misconfig) → helmet; API8 (injection) → Prisma; API9 (improper assets) → versioning; API10 (insufficient logging) → correlation ID + structured logs. |
| **CSP** | Content Security Policy. | `helmet.contentSecurityPolicy()` — restrito a self + CDN permitido. |
| **CORS** | Cross-Origin Resource Sharing. | `origin: [app.domain, admin.domain]`; `credentials: true`. |
| **CSRF** | Cross-Site Request Forgery. | SameSite=Strict cookies + `X-CSRF-Token` header para mutações (futuro). |
| **SSRF** | Server-Side Request Forgery. | Allowlist de URLs externas (ERP, email); timeout curto; sem redirect. |
| **SQL Injection** | Injeção SQL. | Prisma ORM — queries parameterizadas; sem raw SQL não sanitizado. |
| **XSS** | Cross-Site Scripting. | API-only (sem HTML); `helmet.xssFilter()`; validação de input. |
| **XXE** | XML External Entity. | Não processa XML; `bodyParser` apenas JSON. |
| **Deserialization** | Insecure deserialization. | `class-transformer` com `excludeExtraneousValues: true`; sem `eval`/`Function`. |
| **Secret Rotation** | Rotação de segredos. | Vault/SealedSecrets; rotação automática 90d; JWT secrets rotacionados sem downtime (dual key). |

### Decisões de Arquitetura
- **ADR-0001**: Tenant Boundary (isolation = security boundary)

### Código Relacionado
- `apps/api/src/auth/` — JWT, refresh, argon2, roles
- `apps/api/src/common/guards/` — `AuthGuard`, `TenantGuard`, `RolesGuard`
- `apps/api/src/main.ts` — `helmet`, `cors`, `rateLimit`
- `apps/api/src/common/interceptors/sanitize.interceptor.ts`

---

## 7. Performance

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Big O** | Complexidade assintótica. | Queries O(log n) via índices; evita N+1 com `include` otimizado. |
| **Complexity Analysis** | Análise de tempo/espaço. | Documentado em ADRs para algoritmos de pricing (O(rules × components)). |
| **Caching** | Armazenamento temporário para acesso rápido. | Redis: catálogo (TTL 1h), regras aprovadas (TTL 30min), pricing context (TTL 5min). |
| **Cache Aside** | App gerencia cache. | `CacheService` com `getOrSet(key, factory, ttl)`. |
| **Write Through** | Escrita atualiza cache + DB. | Invalidação em mutação (`cache.del(pattern)`). |
| **Write Behind** | Escrita assíncrona no DB. | Não usado; consistência forte requerida. |
| **Read Through** | Cache carrega automaticamente. | `getOrSet` implementa read-through. |
| **N+1 Query** | N queries filhas para 1 pai. | Prevenido: `include` + `select` em Prisma; `DataLoader` para GraphQL futuro. |
| **Lazy Loading** | Carrega sob demanda. | Prisma `include` explícito; sem lazy loading transparente. |
| **Eager Loading** | Carrega tudo antecipadamente. | Usado em `calculateQuoteVersion` (config + items + rules + components). |
| **Connection Pool** | Pool de conexões DB. | `PrismaClient` pool: `connection_limit=20` (ajustado por carga). |
| **Thread Pool** | Pool de threads. | Node.js single-threaded; worker threads para BOM generation pesado. |
| **Memory Pool** | Pool de objetos reutilizáveis. | Não aplicável (GC managed). |
| **Streaming** | Processamento em fluxo. | `stream` para exportação CSV/PDF de relatórios grandes. |
| **Batch Processing** | Processamento em lote. | Jobs noturnos: sincronização ERP, relatórios, limpeza de idempotency keys. |
| **Pagination** | Divisão de resultados. | Cursor pagination (padrão); offset para admin. |

### Decisões de Arquitetura
- **ADR-0002**: Component Catalog Model (indexação, queries)
- **ADR-0004**: Pricing (cache de regras)

### Código Relacionado
- `apps/api/src/common/cache/cache.service.ts` — Redis wrapper
- `apps/api/src/catalog/catalog.service.ts` — queries otimizadas
- `apps/api/src/pricing/pricing.service.ts` — cache de regras
- `apps/api/src/common/dataloader/` — DataLoader para N+1 (futuro GraphQL)

---

## 8. Banco de Dados

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **ACID** | Atomicity, Consistency, Isolation, Durability. | PostgreSQL + Prisma transactions. |
| **BASE** | Basically Available, Soft state, Eventual consistency. | Não aplicável (sistema transacional). |
| **Normalização** | Eliminação de redundância. | 3NF para core; JSONB para snapshots flexíveis (`configurationSnapshot.snapshotData`, `BomVersion.bomData`). |
| **Desnormalização** | Redundância controlada para performance. | `QuoteVersion.totalAmount` calculado e armazenado; `Order.status` denormalizado de `Shipment`. |
| **Indexação** | Índices para busca rápida. | Índices compostos: `(tenantId, status, createdAt)`, `(tenantId, quoteId, versionNumber)`, `(tenantId, customerId)`. |
| **Composite Index** | Índice multi-coluna. | Usado extensivamente para queries multi-tenant + filtro + ordenação. |
| **Covering Index** | Índice que cobre query (evita table lookup). | `(tenantId, status, createdAt) INCLUDE (totalAmount)` para listagem de quotes. |
| **Partitioning** | Divisão física de tabela. | Não necessário (<100M rows); futuro: partição por `tenantId` + `createdAt` mensal. |
| **Sharding** | Divisão horizontal cross-node. | Não necessário; vertical scaling + read replicas. |
| **Replication** | Cópia de dados para réplicas. | 1 primary + 2 read replicas (async); failover automático. |
| **Read Replica** | Réplica para leitura. | `PrismaClient` secundário para relatórios analíticos (`@ReadReplica()` decorator). |
| **Materialized View** | View persistida pré-computada. | `mv_tenant_monthly_revenue` refrescada a cada 1h. |
| **Query Plan** | Plano de execução do otimizador. | `EXPLAIN ANALYZE` em queries críticas; monitorado via `pg_stat_statements`. |
| **Explain Analyze** | Análise real de execução. | Parte de CI: `pnpm db:explain` roda em queries marcadas. |

### Decisões de Arquitetura
- **ADR-0001**: Tenant Boundary (row-level security via `tenantId`)
- **ADR-0002**: Component Catalog (JSONB attributes)
- **ADR-0005**: BOM Versioning (snapshots JSONB)

### Código Relacionado
- `apps/api/prisma/schema.prisma` — modelos, índices, enums
- `apps/api/prisma/migrations/` — migrações versionadas
- `apps/api/src/tenancy/prisma-tenant-scope.ts` — middleware de escopo

---

## 9. Mensageria

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Kafka** | Log distribuído particionado. | Produção: Kafka (Confluent Cloud); Dev: Kafka local (Testcontainers). |
| **RabbitMQ** | Message broker AMQP. | Não usado; Kafka atende casos de uso. |
| **SQS** | Fila AWS. | Não usado. |
| **Pub/Sub** | Publicação/assinatura. | Kafka topics por domínio: `quote.events`, `order.events`, `bom.events`, `shipment.events`. |
| **Ordering** | Garantia de ordem. | Partição por `aggregateId` (quoteId, orderId) → ordem por agregado. |
| **Delivery Guarantee** | Semântica de entrega. | **At-least-once** (Kafka default) + idempotência no consumer → **effectively-once**. |
| **At Most Once** | Entrega no máximo uma vez. | Não usado (perda inaceitável). |
| **At Least Once** | Entrega pelo menos uma vez. | Padrão Kafka; consumidores idempotentes. |
| **Exactly Once** | Entrega exatamente uma vez. | Transações Kafka + idempotência; "exactly-once" com ressalvas. |
| **DLQ** | Dead Letter Queue. | Topic `*.dlq` para mensagens falhas após 3 retries; alerta + reprocessamento manual. |
| **Retry Queue** | Fila de retentativa. | Backoff exponencial via Kafka `retry.topic` + `delay` header. |
| **Poison Message** | Mensagem que sempre falha. | Movida para DLQ após max retries; investigação obrigatória. |
| **Outbox Pattern** | Escrita atômica DB + evento. | Tabela `OutboxEvent` + `OutboxPublisher` (polling 100ms) → Kafka. Garante atomicidade. |
| **Inbox Pattern** | Deduplicação de eventos recebidos. | Tabela `InboxEvent` com `eventId` único; consumer verifica antes de processar. |

### Decisões de Arquitetura
- **ADR-0003**: Configuration and Rule Engine (events para rule evaluation)
- **ADR-0005**: BOM Versioning and Order Handoff (Outbox para ERP sync)

### Código Relacionado
- `apps/api/src/common/events/outbox.ts` — `OutboxEvent`, `OutboxPublisher`
- `apps/api/src/common/events/inbox.ts` — `InboxConsumer`, deduplicação
- `apps/api/src/common/events/event-bus.ts` — abstração sobre Kafka
- `apps/api/src/orders/orders.service.ts` — emite `OrderCreated` via outbox

---

## 10. Observabilidade

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Structured Logging** | Logs em JSON com campos consistentes. | `pino` + `nestjs-pino`; campos: `timestamp`, `level`, `correlationId`, `tenantId`, `userId`, `msg`, `err`. |
| **Metrics** | Métricas quantitativas. | `prom-client` + `/metrics` endpoint; custom metrics: `http_request_duration_seconds`, `db_query_duration`, `cache_hit_ratio`, `quote_calculated_total`. |
| **Tracing** | Rastreamento distribuído. | `OpenTelemetry` + `Jaeger`; spans automáticos (HTTP, DB, Kafka); `correlationId` propagado. |
| **Correlation ID** | ID que correlaciona requests. | `X-Correlation-ID` header; gerado no gateway; incluído em logs, traces, eventos. |
| **Span** | Unidade de trabalho no trace. | Cada controller, service, DB query, Kafka produce/consume = span. |
| **Trace** | Árvore de spans. | Visualizado no Jaeger; sampling 10% (100% em erros). |
| **OpenTelemetry** | Framework de observabilidade. | `@opentelemetry/sdk-node` + auto-instrumentations. |
| **SLI** | Service Level Indicator. | Latência p99 < 500ms; taxa erro < 0.1%; disponibilidade > 99.9%. |
| **SLO** | Service Level Objective. | Definido por endpoint crítico; alerta se violado por 5min. |
| **SLA** | Service Level Agreement. | Contrato com cliente: 99.9% uptime, suporte 9-18 BRT. |
| **Error Budget** | Orçamento de erro (1 - SLO). | Gasto do error budget dispara alerta; freeze de deploy se esgotado. |
| **RED Method** | Rate, Errors, Duration. | Dashboard Grafana por serviço: `rate(http_requests_total)`, `rate(http_errors_total)`, `histogram_quantile(0.99, http_duration)`. |
| **USE Method** | Utilization, Saturation, Errors. | Infra: CPU, memoria, disco, network, DB connections. |

### Decisões de Arquitetura
- **ADR-0006**: First Vertical API Surface (define endpoints monitorados)

### Código Relacionado
- `apps/api/src/main.ts` — OpenTelemetry setup, pino logger
- `apps/api/src/common/observability/` — metrics, tracing helpers
- `docker-compose.observability.yml` — Prometheus, Grafana, Jaeger, Loki

---

## 11. Engenharia de Qualidade

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Unit Tests** | Testes de unidade isolados. | Jest; coverage mínimo 80% em services, 100% em domain logic (pricing, rules). |
| **Integration Tests** | Testes com dependências reais (DB, Kafka). | Testcontainers (Postgres, Kafka, Redis); `pnpm test:integration`. |
| **Contract Tests** | Testes de contrato entre serviços. | Pact (futuro, para microserviços); hoje: OpenAPI validation em CI. |
| **E2E Tests** | Testes ponta-a-ponta. | Playwright + Browserbase; fluxo vertical completo (login → order → InProduction). |
| **Smoke Tests** | Testes rápidos de sanidade. | `smoke-flow.sh` (curl) + health checks em deploy. |
| **Mutation Testing** | Mutação de código para validar testes. | Stryker (JS/TS) em CI; threshold 70% mutation score. |
| **Snapshot Testing** | Comparação com snapshot salvo. | Jest snapshots para DTOs, OpenAPI schema, UI components. |
| **Property Based Testing** | Testes com geração de dados aleatórios. | `fast-check` para regras de pricing, validação de configuração. |
| **Chaos Engineering** | Injeção de falhas controlada. | LitmusChaos em staging: kill pod, network partition, DB failover. |
| **Load Testing** | Teste de carga. | k6 scripts: 1000 VUs, ramp 10min; valida SLIs. |
| **Stress Testing** | Teste além da capacidade. | k6: spike para 5000 VUs; identifica breaking point. |
| **Soak Testing** | Teste de longa duração. | 24h em staging; detecta memory leaks, connection leaks. |
| **Fuzz Testing** | Inputs aleatórios/inválidos. | `fast-check` em endpoints públicos; OWASP ZAP scan semanal. |

### Decisões de Arquitetura
- **ADR-0006**: API Surface (define contratos testáveis)

### Código Relacionado
- `apps/api/test/` — unit, integration, e2e
- `apps/api/scripts/smoke-flow.sh` — smoke test reproduzível
- `.github/workflows/ci.yml` — pipeline com todos os tipos de teste

---

## 12. DevOps

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **CI/CD** | Integração/Entrega Contínua. | GitHub Actions: `ci.yml` (lint, typecheck, test, build), `cd-staging.yml`, `cd-prod.yml`. |
| **GitOps** | Estado desejado em Git. | ArgoCD (futuro); hoje: Helm values em repo, deploy via Actions. |
| **Blue/Green** | Duas ambientes idênticos. | Staging = Blue; Production = Green; switch via DNS/Ingress. |
| **Canary** | Rollout gradual. | 5% → 25% → 100% em 30min; métricas RED monitoradas; rollback automático se SLO violado. |
| **Rolling Update** | Atualização incremental. | Kubernetes `RollingUpdate` strategy (maxSurge=25%, maxUnavailable=0). |
| **Feature Flags** | Toggle de funcionalidade. | `unleash` (self-hosted); flags: `new-pricing-engine`, `bom-v2`, `erp-sync-v2`. |
| **Immutable Infrastructure** | Servidores não modificados após deploy. | Containers imutáveis; sem SSH; config via env/ConfigMap. |
| **IaC** | Infrastructure as Code. | Terraform (AWS/GCP); Helm (K8s); versionado em `infra/`. |
| **Terraform** | Provisionamento declarativo. | `infra/terraform/` — VPC, RDS, ElastiCache, EKS, IAM. |
| **Kubernetes** | Orquestração de containers. | EKS 1.28; namespaces por env; HPA + VPA. |
| **Helm** | Package manager K8s. | `infra/helm/cpq-api/` — chart com values por env. |
| **Docker** | Containerização. | Multi-stage build; distroless base; non-root user; SBOM via `syft`. |
| **Observability** | Ver seção 10. | Integrado no pipeline: dashboards provisionados via Terraform. |

### Decisões de Arquitetura
- **ADR-0001**: Tenant Boundary (influencia namespace/isolation em K8s)

### Código Relacionado
- `.github/workflows/` — pipelines CI/CD
- `infra/` — Terraform, Helm charts
- `Dockerfile` — multi-stage, distroless
- `docker-compose.yml` — dev local completo

---

## 13. Produto

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **Domain Discovery** | Exploração do domínio com experts. | Event Storming workshops com fabricantes de painéis; resultado em `docs/domain/`. |
| **Event Storming** | Workshop colaborativo de modelagem. | Realizado; identificou: `Quote`, `Configuration`, `Rule`, `BOM`, `Order`, `Shipment` como aggregates. |
| **User Story Mapping** | Mapa de histórias do usuário. | Mapa: `Discover → Configure → Quote → Approve → Produce → Ship → Invoice`. |
| **Impact Mapping** | Conecta entregas a objetivos. | Objetivo: "Reduzir tempo de quote em 50%"; entregas: config engine, pricing automático, BOM instantâneo. |
| **Jobs To Be Done** | Foco no "job" do cliente. | "Como engenheiro de vendas, quero configurar painel válido em <5min para responder cliente rápido." |
| **Lean Startup** | Build-Measure-Learn. | MVP: fluxo vertical validado (`smoke-flow.sh`); métricas: lead time quote, taxa erro config. |
| **MVP** | Minimum Viable Product. | Backend completo + API docs; Frontend em construção. |
| **Product Discovery** | Descoberta contínua. | Entrevistas semanais com 3 fabricantes parceiros; backlog priorizado por RICE. |
| **Product Delivery** | Entrega contínua de valor. | Deploy semanal em staging; mensal em prod; feature flags para rollout controlado. |
| **RICE** | Reach, Impact, Confidence, Effort. | Priorização de backlog; score > 500 = next sprint. |
| **MoSCoW** | Must, Should, Could, Won't. | Sprint planning: Must (bugs, security), Should (features), Could (nice-to-have), Won't (deferred). |
| **Kano Model** | Classificação de satisfação. | Básico: quote válido; Performance: velocidade; Encantador: BOM 3D preview. |

### Decisões de Arquitetura
- **ADR-0002**: Component Catalog (domain discovery → attribute templates)
- **ADR-0003**: Rule Engine (domain discovery → constraint rules)
- **ADR-0004**: Pricing (domain discovery → markup, discount rules)

### Código Relacionado
- `docs/domain/` — event storming outputs, user story map
- `docs/adr/` — ADRs vinculados a descobertas de produto

---

## 14. Engenharia Moderna

### Conceitos Obrigatórios

| Conceito | Definição | Aplicação no Projeto |
|----------|-----------|---------------------|
| **ADR** | Architecture Decision Records. | `docs/adr/0001-...` a `0007-...`; template padronizado; revisados em PR. |
| **C4 Model** | Context, Containers, Components, Code. | `docs/architecture/c4/` — diagrams PlantUML; Context + Container atuais. |
| **arc42** | Template de documentação de arquitetura. | `docs/architecture/arc42/` — seções 1-12 preenchidas. |
| **Twelve-Factor App** | 12 princípios para apps cloud-native. | Cumprido: codebase, dependencies, config (env), backing services, build/release/run, processes, port binding, concurrency, disposability, dev/prod parity, logs, admin processes. |
| **Platform Engineering** | Plataforma interna para desenvolvedores. | `infra/platform/` — templates, golden paths, CLI `cpq-cli`. |
| **Internal Developer Platform (IDP)** | Portal self-service para devs. | Backstage (futuro); hoje: docs + scripts + templates. |
| **Golden Path** | Caminho recomendado/padrão. | `pnpm create cpq-service` gera módulo NestJS com testes, docs, CI. |
| **Software Supply Chain** | Cadeia de suprimentos de software. | `renovate` para deps; `syft` SBOM; `cosign` assinatura de imagens; `slsa` level 2. |
| **SBOM** | Software Bill of Materials. | Gerado em CI: `syft packages dir:. -o spdx-json=sbom.spdx.json`. |
| **SLSA** | Supply-chain Levels for Software Artifacts. | Level 2: build service + provenance; assinatura `cosign`. |
| **Provenance** | Origem e histórico do artefato. | `cosign attest --predicate=sbom.spdx.json --type=spdx` na imagem. |
| **Reproducible Builds** | Build determinístico. | `pnpm` lockfile v6; `Dockerfile` com `--mount=type=cache`; `SOURCE_DATE_EPOCH`. |

### Decisões de Arquitetura
- Todos os ADRs seguem este padrão.

### Código Relacionado
- `docs/adr/` — ADRs
- `docs/architecture/c4/` — diagramas C4
- `docs/architecture/arc42/` — documentação arc42
- `.github/workflows/supply-chain.yml` — SBOM, assinatura, SLSA

---

## Referências Cruzadas Rápidas

| Categoria | ADRs Relacionados | Arquivos-Chave |
|-----------|-------------------|----------------|
| Consistência/Concorrência | ADR-0007, ADR-0001 | `prisma-tenant-scope.ts`, `quotes.service.ts`, `orders.service.ts` |
| Sistemas Distribuídos | ADR-0003, ADR-0005 | `outbox.ts`, `event-bus.ts`, `orders.service.ts` |
| APIs | ADR-0006 | `main.ts`, `correlation-id.interceptor.ts`, `idempotency.interceptor.ts` |
| Resiliência | ADR-0003, ADR-0004 | `circuit-breaker.ts`, `retry.ts`, `health.controller.ts` |
| Arquitetura | ADR-0001 a 0007 | `apps/api/src/` (modular), `packages/shared/` |
| Segurança | ADR-0001 | `auth/`, `guards/`, `main.ts` (helmet, cors) |
| Performance | ADR-0002, ADR-0004 | `cache.service.ts`, `catalog.service.ts`, `pricing.service.ts` |
| Banco de Dados | ADR-0001, ADR-0002, ADR-0005 | `schema.prisma`, `migrations/`, `prisma-tenant-scope.ts` |
| Mensageria | ADR-0003, ADR-0005 | `outbox.ts`, `inbox.ts`, `event-bus.ts` |
| Observabilidade | ADR-0006 | `main.ts` (OTel), `health.controller.ts`, `metrics/` |
| Qualidade | ADR-0006 | `test/`, `smoke-flow.sh`, `ci.yml` |
| DevOps | — | `.github/workflows/`, `infra/`, `Dockerfile` |
| Produto | ADR-0002, 0003, 0004 | `docs/domain/`, `docs/adr/` |
| Engenharia Moderna | Todos ADRs | `docs/adr/`, `docs/architecture/`, `supply-chain.yml` |

---

## Checklist de Conformidade (Principal/Staff)

- [ ] Todos os 14 tópicos documentados e vinculados a código/ADRs
- [ ] Conceitos obrigatórios (marcados com ⭐) implementados ou com decisão explícita de não aplicar
- [ ] ADRs numerados, versionados, com status (Proposed/Accepted/Superseded)
- [ ] Diagramas C4 atualizados (Context, Container, Component)
- [ ] Documentação arc42 completa
- [ ] Pipeline CI/CD com: lint, typecheck, unit, integration, e2e, mutation, contract, smoke, load
- [ ] Observabilidade: logs estruturados, métricas RED, traces, SLIs/SLOs, alertas
- [ ] Segurança: OWASP Top 10 + API Security mitigados; secrets rotacionados; SBOM assinado
- [ ] Supply chain: SLSA Level 2+, proveniência, builds reprodutíveis
- [ ] Documentação de produto: Event Storming, User Story Map, Impact Map, JTBD
- [ ] Runbooks para incidentes críticos (failover DB, rollback deploy, DLQ processing)

---

*Documento vivo — atualizado a cada ADR ou mudança arquitetural significativa.*