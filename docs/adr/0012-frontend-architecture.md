# ADR 0012: Frontend Architecture (Auth + Data Fetching)

**Status**: Aceito  
**Data**: Julho 2026

## Contexto

O frontend era um protótipo high-fidelity sem integração com o backend. Para transformar em produto funcional, precisávamos decidir: estratégia de autenticação, gerenciamento de dados, e proteção de rotas.

## Decisão

### Autenticação: NextAuth v5 + Credentials Provider
- **Porquê**: O backend já emite JWT via `POST /auth/login`. NextAuth v5 gerencia sessão, refresh token, e proteção de rotas via `middleware.ts`.
- **Alternativas consideradas**: JWT Cookie (mais simples, menos features), JWT localStorage (vulnerável a XSS).

### API Client: Fetch wrapper com interceptors
- **Porquê**: Deep module (interface pequena `api.get/post/patch/delete`, implementação rica com interceptors de auth + tenant).
- **Interceptors**: Adicionam `Authorization: Bearer` e `X-Tenant-ID` automaticamente. Disparam evento `api:unauthorized` no 401.

### Estado: Zustand (local) + React Query (server)
- **Porquê**: Builder é interativo e local (Zustand). Dados transacionais vêm do servidor (React Query com cache, refetch, optimistic updates).
- **Alternativas consideradas**: SWR (mais leve, menos features), Fetch manual (mais boilerplate).

### Proteção de Rotas: middleware.ts
- **Porquê**: NextAuth middleware + guard customizado. `/login` público, `/configure/**` autenticado, `/admin/**` super admin.

### LGPD no Frontend
- **Porquê**: Legal requirement (Lei 13.709/2018). Backend completo, frontend pendente.
- **Pendente**: Consent banner, privacy page, data subject request form.

## Consequências

- NextAuth v5 é beta — pode ter breaking changes.
- API Client é testável através de mocking do fetch.
- Zustand mantém estado do builder isolado da camada de servidor.
- middleware.ts protege rotas antes mesmo do React hidratar.

## Referências

- [NextAuth v5 Docs](https://authjs.dev/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [LGPD Lei 13.709/2018](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
