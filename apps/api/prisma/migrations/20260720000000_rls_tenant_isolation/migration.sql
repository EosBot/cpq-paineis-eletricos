-- ============================================================
-- ADR 0009: Row-Level Security para Tenant Isolation
-- Habilita RLS em todas as tabelas tenant-scoped
-- ============================================================

-- 1. Habilitar RLS nas tabelas tenant-scoped
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerContact" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CommercialContract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ComponentCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ComponentAttributeTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Component" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ComponentAttribute" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Configuration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConfigurationItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConfigurationSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Rule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RuleVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuoteVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuoteVersionRule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BOMVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Shipment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ShippingQuote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- 2. Policies de isolamento (SELECT/INSERT/UPDATE/DELETE)
-- Cada policy garante que tenantId = current_setting('app.current_tenant')

-- Membership
CREATE POLICY tenant_isolation ON "Membership"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Role
CREATE POLICY tenant_isolation ON "Role"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- CustomerAccount
CREATE POLICY tenant_isolation ON "CustomerAccount"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- CustomerContact
CREATE POLICY tenant_isolation ON "CustomerContact"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- CommercialContract
CREATE POLICY tenant_isolation ON "CommercialContract"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- ComponentCategory
CREATE POLICY tenant_isolation ON "ComponentCategory"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- ComponentAttributeTemplate
CREATE POLICY tenant_isolation ON "ComponentAttributeTemplate"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Component
CREATE POLICY tenant_isolation ON "Component"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- ComponentAttribute
CREATE POLICY tenant_isolation ON "ComponentAttribute"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Configuration
CREATE POLICY tenant_isolation ON "Configuration"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- ConfigurationItem
CREATE POLICY tenant_isolation ON "ConfigurationItem"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- ConfigurationSnapshot
CREATE POLICY tenant_isolation ON "ConfigurationSnapshot"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Rule
CREATE POLICY tenant_isolation ON "Rule"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- RuleVersion
CREATE POLICY tenant_isolation ON "RuleVersion"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Quote
CREATE POLICY tenant_isolation ON "Quote"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- QuoteVersion
CREATE POLICY tenant_isolation ON "QuoteVersion"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- QuoteVersionRule (tabela de junção — RLS via quoteVersion)
CREATE POLICY tenant_isolation ON "QuoteVersionRule"
  USING (
    EXISTS (
      SELECT 1 FROM "QuoteVersion" qv
      WHERE qv.id = "QuoteVersionRule"."quoteVersionId"
      AND qv."tenantId" = current_setting('app.current_tenant')::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "QuoteVersion" qv
      WHERE qv.id = "QuoteVersionRule"."quoteVersionId"
      AND qv."tenantId" = current_setting('app.current_tenant')::text
    )
  );

-- BOMVersion
CREATE POLICY tenant_isolation ON "BOMVersion"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Order
CREATE POLICY tenant_isolation ON "Order"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- Shipment
CREATE POLICY tenant_isolation ON "Shipment"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- ShippingQuote
CREATE POLICY tenant_isolation ON "ShippingQuote"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);

-- AuditLog
CREATE POLICY tenant_isolation ON "AuditLog"
  USING ("tenantId" = current_setting('app.current_tenant')::text)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant')::text);
