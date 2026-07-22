# ADR 0009 - Row-Level Security (RLS) para Tenant Isolation

## Status
Accepted

## Context
O ADR 0001 definiu row-level isolation com `tenantId` como estratégia inicial. A implementação atual usa Prisma Middleware (`applyTenantScope`) para injetar `tenantId` em todas as queries. Identificamos 3 vulnerabilidades:

1. **Eager loading**: `Quote.findUnique({ include: { orders: true } })` executa query separada para `orders` que NÃO passa pelo middleware — vaza dados entre tenants.
2. **findUnique com unique composto**: `withTenantUniqueWhere` injeta `tenantId` no `where` de chaves que não o contêm (ex.: `[componentCategoryId, code]` em `ComponentAttributeTemplate`), causando `PrismaClientValidationError`.
3. **Raw SQL**: `$queryRaw` ignora completamente o middleware, expondo todos os dados.

## Decision
Adicionar PostgreSQL Row-Level Security (RLS) como camada de segurança primária:

- Habilitar RLS em todas as 22 tabelas tenant-scoped
- Criar policy `tenant_isolation` com `USING` (leitura) e `WCHECK` (escrita)
- Usar `SET LOCAL app.current_tenant = '...'` no início de cada transação via `$transactionWithRLS`
- Manter Prisma Middleware como otimização (reduz queries retornando tudo)
- Tabelas `Tenant` e `User` ficam SEM RLS (tabelas globais de catálogo/identidade)

## Consequences
### Positive
- Isolamento enforcado no DB — impossível bular via aplicação
- Funciona com eager loading, raw SQL, upsert, tudo
- Padrão-ouro da indústria (Supabase, Neon, etc.)
- Defense-in-depth: middleware + RLS

### Negative
- Migration mais complexa (22 tabelas × policy cada)
- Debug mais difícil (queries falham silenciosamente se RLS bloqueia)
- `SET LOCAL` precisa ser chamado por transação (não global)

## Alternatives considered
- **Apenas middleware (atual)**: Rejeitado — vulnerável aos 3 bugs acima
- **Schema-per-tenant**: Rejeitado — custo operacional alto demais para fase atual
- **Service layer obrigatória**: Rejeitado — disciplina humana falha
