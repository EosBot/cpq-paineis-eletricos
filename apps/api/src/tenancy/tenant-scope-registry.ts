const TENANT_SCOPED_MODELS = [
  'Membership',
  'Role',
  'CustomerAccount',
  'CustomerContact',
  'CommercialContract',
  'ComponentCategory',
  'ComponentAttributeTemplate',
  'Component',
  'ComponentAttribute',
  'Configuration',
  'ConfigurationItem',
  'ConfigurationSnapshot',
  'Rule',
  'RuleVersion',
  'Quote',
  'QuoteVersion',
  'BOMVersion',
  'Order',
  'Shipment',
  'ShippingQuote',
  'AuditLog',
] as const;

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

const TENANT_SCOPED_MODEL_SET = new Set<string>(TENANT_SCOPED_MODELS);

export function isTenantScopedModel(modelName: string): modelName is TenantScopedModel {
  return TENANT_SCOPED_MODEL_SET.has(modelName);
}

export function getTenantScopedModels(): readonly TenantScopedModel[] {
  return TENANT_SCOPED_MODELS;
}
