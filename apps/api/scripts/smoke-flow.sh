#!/usr/bin/env bash
#
# smoke-flow.sh - Validacao vertical do CPQ (quote -> BOM -> order -> InProduction)
# Reproduzivel: sobe a cadeia completa contra a API NestJS ja em execucao.
#
# Pre-requisitos:
#   - Postgres em localhost:5432 (container cpq-postgres)
#   - API NestJS em http://localhost:3000 (pnpm --filter api start)
#   - Seed ja executado (pnpm --filter api seed) -> tenant demo-paineis + admin
#   - jq instalado (extracao de IDs)
#
# Observacao: o tenant context e derivado do JWT (login), nao dos headers
# x-tenant-id/x-user-id (estes sao no-ops neste backend). O script envia os
# headers por compatibilidade, mas o acesso real usa o token Bearer.
#
# Uso:
#   bash apps/api/scripts/smoke-flow.sh
#
set -eu

BASE="http://localhost:3000/api/v1"
TENANT_ID="cmro3edgv0000271cvwtxuxa9"
USER_ID="cmro3edm50003271cg5vxom6c"
EMAIL="admin@paineisdemo.com"
PASSWORD="SenhaForte@123"
CATEGORY_ID="cmro3edmw0007271c8q3wxmeb"
COMPONENT_ID="cmro3ednh000c271cb3xbff3v"   # DJ-32A-2P
CUSTOMER_ID="cmro3edpj000s271c13i82cef"

# Sufixo unico por execucao -> evita unique constraint em quoteNumber/orderNumber em re-execucoes.
RUN_TS=$(date +%s)

# Headers sem espaco: palavra unica, expandem sem problemas.
H_TENANT=(-H "x-tenant-id:${TENANT_ID}")
H_USER=(-H "x-user-id:${USER_ID}")
H_JSON=(-H "Content-Type: application/json")

pass() { echo -e "\n[OK] $1"; }
fail() { echo -e "\n[FAIL] $1"; exit 1; }

# Extrai campo de nivel superior com jq (evita pegar id de sub-objetos).
jid() { jq -r "$1"; }

echo "== 1. LOGIN =="
LOGIN_BODY=$(jq -n --arg e "$EMAIL" --arg p "$PASSWORD" --arg t "$TENANT_ID" \
  '{email:$e,password:$p,tenantId:$t}')
LOGIN_RESP=$(curl -s "${H_JSON[@]}" -X POST "$BASE/auth/login" -d "$LOGIN_BODY")
echo "$LOGIN_RESP"
TOKEN=$(echo "$LOGIN_RESP" | jid '.accessToken')
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || fail "login falhou (sem accessToken)"
# Array garante que -H e "Authorization: Bearer $TOKEN" cheguem como UM argumento.
H_AUTH=(-H "Authorization: Bearer $TOKEN")
pass "login OK (token len=${#TOKEN})"

echo "== 2. CATALOG (categoria + componentes ja no seed) =="
CAT_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" "$BASE/catalog/component-categories")
if echo "$CAT_RESP" | grep -q "$CATEGORY_ID"; then pass "categoria listada"; else fail "categoria nao listada: $CAT_RESP"; fi
COMP_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" "$BASE/catalog/components")
if echo "$COMP_RESP" | grep -q "$COMPONENT_ID"; then pass "componente listado"; else fail "componente nao listado: $COMP_RESP"; fi

echo "== 3. QUOTE =="
QUOTE_BODY=$(jq -n --arg c "$CUSTOMER_ID" --arg n "Q-${RUN_TS}" \
  '{customerAccountId:$c,quoteNumber:$n,title:"Quadro de distribuicao",currencyCode:"BRL"}')
QUOTE_HDRS=$(mktemp)
QUOTE_RESP=$(curl -s -D "$QUOTE_HDRS" "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/quotes" -d "$QUOTE_BODY")
echo "$QUOTE_RESP"
QUOTE_ID=$(echo "$QUOTE_RESP" | jid '.id')
[ -n "$QUOTE_ID" ] && [ "$QUOTE_ID" != "null" ] || fail "quote nao criada"
# Captura o correlation-id injetado pelo CorrelationIdInterceptor (header de resposta).
CORR_ID=$(grep -i '^x-correlation-id:' "$QUOTE_HDRS" | awk '{print $2}' | tr -d '\r')
pass "quote OK ($QUOTE_ID)"

echo "== 4. CONFIGURATION =="
CONF_BODY=$(jq -n --arg q "$QUOTE_ID" --arg c "$COMPONENT_ID" \
  '{quoteId:$q,name:"Quadro Demo",items:[{componentId:$c,quantity:"2",positionKey:"Q1"}]}')
CONF_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/configurations" -d "$CONF_BODY")
echo "$CONF_RESP"
CONF_ID=$(echo "$CONF_RESP" | jid '.id')
[ -n "$CONF_ID" ] && [ "$CONF_ID" != "null" ] || fail "configuration nao criada"
pass "configuration OK ($CONF_ID)"

echo "== 5. SUBMIT FOR REVIEW (gera snapshot) =="
SUBMIT_BODY=$(jq -n --arg c "$CONF_ID" '{configurationId:$c}')
SUBMIT_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/configurations/submit-for-review" -d "$SUBMIT_BODY")
echo "$SUBMIT_RESP"
SNAP_ID=$(echo "$SUBMIT_RESP" | jid '.id')
[ -n "$SNAP_ID" ] && [ "$SNAP_ID" != "null" ] || fail "snapshot nao gerado"
pass "submit-for-review OK (snapshot $SNAP_ID)"

echo "== 6. CALCULATE QUOTE (gera quoteVersion) =="
CALC_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/quotes/$QUOTE_ID/calculate")
echo "$CALC_RESP"
QV_ID=$(echo "$CALC_RESP" | jid '.id')
[ -n "$QV_ID" ] && [ "$QV_ID" != "null" ] || fail "quoteVersion nao gerada"
pass "calculate OK (quoteVersion $QV_ID)"

echo "== 7. SEND QUOTE =="
SEND_BODY=$(jq -n --arg q "$QUOTE_ID" '{quoteId:$q}')
SEND_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/quotes/send" -d "$SEND_BODY")
echo "$SEND_RESP"
if echo "$SEND_RESP" | grep -q "SENT"; then pass "quote enviada (SENT)"; else fail "send falhou: $SEND_RESP"; fi

echo "== 8. CUSTOMER APPROVE QUOTE =="
APPROVE_BODY=$(jq -n --arg q "$QUOTE_ID" '{quoteId:$q}')
APPROVE_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/quotes/customer-approve" -d "$APPROVE_BODY")
echo "$APPROVE_RESP"
if echo "$APPROVE_RESP" | grep -q "CUSTOMER_APPROVED"; then pass "quote aprovada pelo cliente (CUSTOMER_APPROVED)"; else fail "customer-approve falhou: $APPROVE_RESP"; fi

echo "== 9. BOM VERSION =="
BOM_BODY=$(jq -n --arg q "$QUOTE_ID" --arg v "$QV_ID" --arg s "$SNAP_ID" \
  '{quoteId:$q,quoteVersionId:$v,configurationSnapshotId:$s}')
BOM_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/bom/versions" -d "$BOM_BODY")
echo "$BOM_RESP"
BOM_ID=$(echo "$BOM_RESP" | jid '.id')
[ -n "$BOM_ID" ] && [ "$BOM_ID" != "null" ] || fail "bom version nao gerada"
pass "bom version OK ($BOM_ID)"

echo "== 10. CONVERT QUOTE -> ORDER =="
CONV_BODY=$(jq -n --arg q "$QUOTE_ID" --arg n "ORD-${RUN_TS}" '{quoteId:$q,orderNumber:$n}')
CONV_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/orders/convert" -d "$CONV_BODY")
echo "$CONV_RESP"
ORDER_ID=$(echo "$CONV_RESP" | jid '.id')
[ -n "$ORDER_ID" ] && [ "$ORDER_ID" != "null" ] || fail "order nao criada"
pass "convert OK (order $ORDER_ID)"

echo "== 11. ADVANCE ORDER -> IN_PRODUCTION =="
ADV_BODY=$(jq -n --arg o "$ORDER_ID" '{orderId:$o,toStatus:"IN_PRODUCTION"}')
ADV_RESP=$(curl -s "${H_TENANT[@]}" "${H_USER[@]}" "${H_AUTH[@]}" "${H_JSON[@]}" -X POST "$BASE/orders/$ORDER_ID/advance" -d "$ADV_BODY")
echo "$ADV_RESP"
if echo "$ADV_RESP" | grep -q "IN_PRODUCTION"; then pass "order avancada para IN_PRODUCTION"; else fail "advance falhou: $ADV_RESP"; fi

echo "== 12. AUDIT LOG (correlation-id + registros) =="
AUDIT_RESP=$(curl -s "${H_AUTH[@]}" "${H_JSON[@]}" "$BASE/audit-logs?entityType=Quote&limit=10")
echo "$AUDIT_RESP"
if echo "$AUDIT_RESP" | grep -q "$QUOTE_ID"; then
  pass "audit log contem entrada para a quote $QUOTE_ID"
else
  fail "audit log nao contem a quote criada"
fi
if [ -n "$CORR_ID" ] && echo "$AUDIT_RESP" | grep -q "$CORR_ID"; then
  pass "correlation-id ($CORR_ID) registrado na auditoria"
else
  fail "correlation-id nao encontrado na auditoria (CORR_ID=${CORR_ID:-vazio})"
fi

echo "== 13. CORS (preflight informativo) =="
PREFLIGHT=$(curl -s -o /dev/null -D - -X OPTIONS "$BASE/quotes" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" || true)
if echo "$PREFLIGHT" | grep -qi "access-control-allow-origin"; then
  pass "CORS habilitado: preflight retornou allow-origin"
else
  echo "[INFO] CORS fail-closed (sem CORS_ORIGIN) ou origem nao permitida — esperado em dev sem frontend."
  echo "[INFO] Defina CORS_ORIGIN no .env da API para habilitar o compartilhamento com o frontend."
fi

echo -e "\n========================================="
echo "CADEIA VERTICAL COMPLETA VALIDADA COM SUCESSO"
echo "========================================="
