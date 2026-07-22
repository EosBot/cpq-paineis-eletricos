# Relatório Consolidado de Code Review — Backend CPQ

- **Data:** 2026-07-17
- **Escopo:** `apps/api` (NestJS 10.4.22 + Prisma 5.19.1) contra a documentação de padrões (`docs/adr/*`, `docs/architecture/ARCHITECTURE_REFERENCE.md`, `docs/adr/contrato.md`)
- **Ponto fixo:** commit inicial `ce52922` (todo o código está no commit base; `git diff ce52922...HEAD` mostra apenas `.gitignore`)
- **Eixos avaliados:** Standards (padrões documentados) e Spec (docs como especificação)

---

## 1. Resumo Executivo

A revisão identificou **5 correções prioritárias de segurança/escopo**, todas aplicadas e validadas (`typecheck` + `build` com exit 0). O tema central foi **isolamento de tenant** (vazamento via headers forjáveis) e **hardening de superfície** (helmet/CORS/rate-limit, atribuição de usuário, segredos JWT).

| # | Correção | Severidade | Status |
|---|----------|-----------|--------|
| 1 | Tenant isolation via JWT (decorator + middleware + interceptor) | Crítica | ✅ Aplicada |
| 2 | Bypass de tenant em `bom`/`catalog` controllers (headers) | Crítica | ✅ Aplicada |
| 3 | Helmet + CORS + rate-limit em `main.ts`/`app.module.ts` | Alta | ✅ Aplicada |
| 4 | User attribution spoofing (`createdByUserId`/`approvedByUserId`) | Média | ✅ Aplicada |
| 5 | Segredos JWT padrão (`change-me-*`) | Alta | ✅ Aplicada |

---

## 2. Eixo Standards (Padrões Documentados)

### 2.1 Achados corrigidos

- **Fonte de identidade de tenant (ADR-0001):** o contrato e a ADR-0001 definem que o limite de tenant deve vir do JWT autenticado. Dois controllers (`bom`, `catalog/component-categories`) construíam `tenantContext` a partir de headers `x-tenant-id`/`x-user-id` — violação direta do padrão e bypass de isolamento. **Corrigido** para usar o decorator `@TenantContext()` (lê `request.user` do JWT).
- **Defense-in-depth de tenant (ADR-0001):** o `PrismaService.$use` já aplicava `applyTenantScope` (fail-closed via `assertTenantContext`). Reforçado com `TenantScopeInterceptor` global (`APP_INTERCEPTOR`) que popula `AsyncLocalStorage` a partir do JWT, garantindo que o middleware tenha contexto mesmo fora do fluxo de controller.
- **Segurança de transporte (contrato §320-353):** ausência de cabeçalhos de segurança e de rate-limit. **Adicionado** `helmet` e `@nestjs/throttler` (guarda global, 20 req/min/IP).
- **Atribuição de auditoria:** DTOs expunham `createdByUserId`/`approvedByUserId` como `@IsOptional()`, permitindo falsificar autoria. **Removidos** dos DTOs; services passam a usar `tenantContext.userId` (sempre do JWT).
- **Segredos (contrato §320-353):** `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` tinham defaults hardcoded (`change-me-*`). **Alterado para fail-closed** (lança erro se a env var não estiver definida).

### 2.2 Conformidade com padrões de nomenclatura/código

- Estrutura de pastas por vertical (slice per domínio) está em conformidade com `ARCHITECTURE_REFERENCE.md`.
- Uso consistente de `ValidationPipe` com `whitelist`/`forbidNonWhitelisted` — conforme padrão.
- `User.email` é globalmente único (não por tenant), logo o login por email em `auth.service.login` está **correto** (não é vulnerabilidade).

---

## 3. Eixo Spec (Docs como Especificação)

### 3.1 Gaps legítimos (escopo não implementado — apenas reportados, não criados)

Estes itens estão documentados mas **não foram implementados** nesta sessão, por decisão de tratar como "escopo não implementado":

- **Swagger/OpenAPI** (contrato §416-437): não há documentação de API exposta.
- **Correlation-ID / tracing** (ARCHITECTURE_REFERENCE, seção Observabilidade): não implementado.
- **Trilha de auditoria granular** (ADR-0007 concorrência/consistência): `createdByUserId`/`approvedByUserId` existem, mas não há tabela de audit log dedicada.
- **Frontend (apps/web):** scripts são stubs (`echo 'not implemented yet'`) — fora do escopo do backend.

### 3.2 Itens menores identificados (não prioritários)

- `main.ts` ainda não configura `app.enableShutdownHooks` nem tratamento de exceções global além do `ValidationPipe`.
- `CORS_ORIGIN` default é `false` (CORS desabilitado) — seguro, mas exige configuração explícita para o frontend funcionar.

---

## 4. Correções Aplicadas — Detalhe

### 4.1 Tenant isolation (JWT) — infraestrutura
- `apps/api/src/tenancy/tenant-context.decorator.ts` (criado): `@TenantContext()` extrai `tenantId`/`userId` do JWT; lança se ausente.
- `apps/api/src/tenancy/tenant-context.storage.ts` (criado): `AsyncLocalStorage<ITenantContext>`.
- `apps/api/src/tenancy/tenant-scope.interceptor.ts` (criado): `APP_INTERCEPTOR` global que popula o storage a partir do `request.user`.
- `apps/api/src/prisma/prisma.service.ts`: `$use` middleware chama `applyTenantScope(params, getTenantContextFromStorage())` (fail-closed).
- `apps/api/src/app.module.ts`: registra `TenantScopeInterceptor` como `APP_INTERCEPTOR` (importado de `@nestjs/core`).

### 4.2 Bypass em controllers
- `apps/api/src/bom/bom.controller.ts`: `generate`/`list` usam `@TenantContext()` em vez de headers.
- `apps/api/src/catalog/component-categories.controller.ts`: `create`/`list` usam `@TenantContext()` em vez de headers.

### 4.3 Helmet + CORS + rate-limit
- Dependências adicionadas: `helmet@^8.3.0`, `@nestjs/throttler@^6.5.0`.
- `apps/api/src/main.ts`: `app.use(helmet())`; `app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? false, credentials: true })`.
- `apps/api/src/app.module.ts`: `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }])` + `ThrottlerGuard` como `APP_GUARD`.

### 4.4 User attribution spoofing
- `apps/api/src/rules/dto/create-rule.dto.ts`: removido `createdByUserId`.
- `apps/api/src/rules/dto/approve-rule-version.dto.ts`: removido `approvedByUserId`.
- `apps/api/src/quotes/dto/create-quote.dto.ts`: removido `createdByUserId`.
- `apps/api/src/rules/rules.service.ts`: `createdByUserId: tenantContext.userId`; `approverUserId = tenantContext.userId`.
- `apps/api/src/quotes/quotes.service.ts`: `createdByUserId: tenantContext.userId`.

### 4.5 Segredos JWT (fail-closed)
- `apps/api/src/auth/auth.module.ts`: `JwtModule.registerAsync` lança se `JWT_ACCESS_SECRET` ausente.
- `apps/api/src/auth/jwt.strategy.ts`: construtor lança se `JWT_ACCESS_SECRET` ausente.
- `apps/api/src/auth/auth.service.ts`: helper `getRefreshSecret()` lança se `JWT_REFRESH_SECRET` ausente; usado em `refresh()` e `issueTokens()`.

---

## 5. Verificação

| Comando | Resultado |
|---------|-----------|
| `pnpm --filter @cpq/api typecheck` | exit 0 (sem erros) |
| `pnpm --filter @cpq/api build` | exit 0 (nest build) |
| Busca `x-tenant-id\|x-user-id\|createTenantContext` (src) | apenas definição em `tenant-context.ts` |
| Busca `dto.(createdByUserId\|approvedByUserId)` | 0 resultados |
| Busca `change-me` (src) | 0 resultados |
| Smoke test de boot (`node dist/main.js`) | módulos inicializados, rotas mapeadas, sem erro ESM |

---

## 6. Próximos Passos Sugeridos (fora desta sessão)

1. Implementar Swagger/OpenAPI e correlation-id (conforme contrato).
2. Tabela de audit log dedicada (ADR-0007).
3. Configurar `CORS_ORIGIN` para o frontend e validar fluxo ponta a ponta.
4. Executar suíte de testes E2E (scripts/smoke-flow.sh) após provisionar banco.
