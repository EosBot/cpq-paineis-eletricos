# Progresso de Implementação — Fase 1 (Marketplace Foundation)

> **Última atualização:** 22/07/2026
> **Status:** Concluída (exceto admin order management — escopo da Fase 3)

---

## Contexto

Este documento registra o progresso detalhado da implementação da Fase 1 do roadmap. Objetivo: fechar o fluxo básico de marketplace (cart → checkout → order → confirmação) e integrar o builder CPQ ao carrinho.

---

## Prioridade 1 — Fluxo Básico de Checkout ✅ CONCLUÍDA

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

---

## Prioridade 2 — Integração Builder → Cart ✅ CONCLUÍDA

### O que foi feito:
- **productId passado via URL**: `?productId=xxx` na rota `/configure`.
- **Builder store** (`apps/web/src/store/builder.ts`) — Adicionado `productId` ao estado.
- **Configure page** (`apps/web/src/app/configure/[configurationId]/page.tsx`) — Lê `productId` da URL e seta no store.
- **Pricing Sidebar** (`apps/web/src/components/builder/pricing-sidebar.tsx`) — Botão "Adicionar ao Carrinho" funcional.
- **configurationData**: Todo o estado do builder (project, enclosure, rails, circuits, placements, pricing) é salvo como JSON no `configurationData` do cart item.

---

## Prioridade 3 — Order Management ✅ CONCLUÍDA

### O que foi feito:
- **Conflito de rotas resolvido**: Consolidado `OrdersController` (CPQ) e `MarketplaceOrderController` em um único `OrdersController` em `apps/api/src/orders/orders.controller.ts`.
- **Página de Detalhe** (`apps/web/src/app/(storefront)/orders/[id]/page.tsx`) — Items, pricing, endereço, timeline de progresso.
- **Histórico de Pedidos** (`apps/web/src/app/(storefront)/account/orders/page.tsx`) — Lista pedidos do cliente com status.

---

## Prioridade 4 — Testes ✅ CONCLUÍDA

### Criados:
- **cart.service.spec.ts** (`apps/api/src/modules/marketplace/cart.service.spec.ts`) — 13 testes.
- **order.service.spec.ts** (`apps/api/src/modules/marketplace/order.service.spec.ts`) — 13 testes.

### Total: 26 novos testes, 72 testes passando na suite completa.

---

## Estrutura do Projeto — Limpeza

### Dead code removido:
- `apps/api/src/modules/marketplace/order.controller.ts` — **REMOVIDO** (consolidado).

### Verificado sem problemas:
- Todos os módulos e controllers estão corretamente conectados via NestJS DI.
- Nenhum import órfão encontrado.
- Nenhum módulo sem uso.

---

## Skills do OpenCode

**Problema**: Skills estavam em `~/.config/opencode/skills/` (WSL) mas o opencode server roda no Windows e procura em `%USERPROFILE%\.config\opencode\skills\`. Skills de `.agents/` também não estavam instaladas.

**Solução**:
1. Copiado 66 skills do WSL para Windows: `C:\Users\thali\.config\opencode\skills\`.
2. Instalado 146 skills de `.agents/awesome-zoocode-skills/skills/` (engenharia, design, produtividade, composio).
3. Total: **216 skills** no Windows.
4. Configurado `permission.skill.*: "allow"` no `opencode.json`.
5. **Ação pendente do usuário**: Reiniciar o opencode server para carregar as skills.

---

## Notas Importantes

- **Validação**: pipe global `whitelist: true` + `forbidNonWhitelisted: true`. DTOs não podem ter campos extras.
- **Multi-tenant**: interceptor global aplica `tenantId`. Nunca adicionar `tenantId` manualmente.
- **Pagamento mockado**: checkout cria pedido sem processar pagamento real.
- **configurationData**: abordagem de salvar JSON completo no cart item evita necessidade de API de configuração separada.

---

## Próximos Passos (Fase 2 — Seller ERP)
1. Cadastro self-service do vendedor
2. CRUD de produtos (seller frontend)
3. Gestão de pedidos (seller frontend — já existe `/seller/orders`)
4. Gestão de estoque
5. Gestão de clientes
6. Módulo financeiro
7. Relatórios e analytics
