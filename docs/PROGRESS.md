# Progresso de Implementação — CPQ Marketplace

> **Última atualização:** 23/07/2026
> **Branch atual:** `dev`

---

## Contexto

Este documento registra o progresso detalhado da implementação do CPQ Marketplace. O projeto é um SaaS multi-tenant de marketplace para fabricantes de painéis elétricos, com módulo CPQ integrado.

---

## Fase 1 — Marketplace Foundation ✅ CONCLUÍDA

### Backend (NestJS)
- **Cart Controller** (`apps/api/src/modules/marketplace/cart.controller.ts`) — CRUD completo.
- **Order Controller** (`apps/api/src/orders/orders.controller.ts`) — Consolidado (CPQ + Marketplace).
- **Order Service** (`apps/api/src/modules/marketplace/order.service.ts`) — `createFromCart()`, `advanceStatus()`, `cancel()`.

### Frontend (Next.js 15)
- **Página de Cart** (`apps/web/src/app/(storefront)/cart/page.tsx`) — Botão "Finalizar Compra" → `/checkout`.
- **Service de Checkout** (`apps/web/src/lib/api/services/storefront.service.ts`) — `checkoutService`.
- **Hooks** (`apps/web/src/lib/api/hooks/use-storefront.ts`) — `useCheckout()`, `useOrder()`, `useOrders()`.
- **Página de Checkout** (`apps/web/src/app/(storefront)/checkout/page.tsx`) — Endereço, envio, observações, resumo, submissão.
- **Página de Confirmação** (`apps/web/src/app/(storefront)/orders/[id]/confirmation/page.tsx`) — Detalhes do pedido, endereço, status.
- **Página de Produto** (`apps/web/src/app/(storefront)/products/[slug]/page.tsx`) — Detalhe individual, ações.
- **Histórico de Pedidos** (`apps/web/src/app/(storefront)/account/orders/page.tsx`) — Lista pedidos do cliente com status.

### Testes
- **cart.service.spec.ts** — 13 testes.
- **order.service.spec.ts** — 13 testes.
- Total: 26 novos testes, 72 testes passando na suite completa.

---

## Fase 2 — Seller ERP 🚧 EM PROGRESSO

### Infraestrutura Completa
- **Layout** (`apps/web/src/app/seller/layout.tsx`) — Sidebar, mobile menu, navegação.
- **Hooks** (`apps/web/src/lib/api/hooks/use-seller.ts`) — 173 linhas, todos os mutations e queries.
- **Services** (`apps/web/src/lib/api/services/seller.service.ts`) — 164 linhas, full CRUD.
- **Types** (`apps/web/src/lib/api/types.ts`) — Tipos TypeScript completos (Customer, Supplier, Order, Financial, etc.).

### Páginas

| Página | Arquivo | Status | O que falta |
|--------|---------|--------|-------------|
| Dashboard | `/seller/page.tsx` | ✅ | Funcional com KPIs reais |
| Products | `/seller/products/page.tsx` | ✅ | CRUD completo (fix aplicado em 23/07) |
| Orders | `/seller/orders/page.tsx` | 🚧 | Falta: avançar status, cancelar, filtro |
| Inventory | `/seller/inventory/page.tsx` | 🚧 | Falta: movimentação de estoque |
| Customers | `/seller/customers/page.tsx` | 🚧 | Falta: editar, deletar, detalhes |
| Suppliers | `/seller/suppliers/page.tsx` | 🚧 | Falta: editar, deletar |
| Financial | `/seller/financial/page.tsx` | 🚧 | Falta: criar transação, filtros |

### O que foi feito em 23/07/2026:
- ✅ **Products Page Update Fix**: Conectado `useUpdateSellerProduct` ao form de edição (commit `e583f51`)
  - Adicionado import do mutation
  - Declarado `const updateProduct = useUpdateSellerProduct()`
  - Preenchido `if (editingProduct)` com `mutateAsync({ id, data })`
  - Botão submit desabilitado no update

---

## Organização do Repositório (23/07/2026)

### Branches

| Branch | Propósito | Tracking |
|--------|-----------|----------|
| `main` | Produção estável | `origin/main` ✅ |
| `dev` | Desenvolvimento ativo | `origin/dev` ✅ |
| `prod` | Releases de produção | `origin/prod` ✅ |

### Mudanças
- Renomeado `master` → `main` (padrão GitHub)
- Criados branches `dev` e `prod` a partir do estado atual
- Todas as branches sincronizadas com `origin`
- Commit `e583f51`: fix(seller): connect update mutation to products page form

---

## Fase 3 — Admin Platform 🚧 PARCIAL

- Backend completo (super-admin, tenants, users, billing)
- Frontend: implementado mas não verificado a fundo

---

## Fase 4 — Integration & Polish 📋 PLANEJADO

- Payment gateway integration
- Email notifications
- File uploads (product images)
- E2E tests (Playwright)
- CI/CD pipeline
- VPS deployment
- Monitoring (Prometheus/Grafana)

---

## Próximos Passos Imediatos

1. **Orders Page** — Adicionar botões "Avançar Status" e "Cancelar", filtro por status
2. **Inventory Page** — Modal de movimentação de estoque (entrada/saída)
3. **Customers Page** — Editar, deletar, visualizar histórico
4. **Suppliers Page** — Editar, deletar
5. **Financial Page** — Criar transação, filtro por período, gerenciar contas

---

## Notas Importantes

- **Validação**: pipe global `whitelist: true` + `forbidNonWhitelisted: true`. DTOs não podem ter campos extras.
- **Multi-tenant**: interceptor global aplica `tenantId`. Nunca adicionar `tenantId` manualmente.
- **Pagamento mockado**: checkout cria pedido sem processar pagamento real.
- **configurationData**: abordagem de salvar JSON completo no cart item evita necessidade de API de configuração separada.
