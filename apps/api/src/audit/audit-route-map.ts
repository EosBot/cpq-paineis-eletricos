export type AuditIdSource = 'result' | 'body' | 'param';

export interface IAuditRouteConfig {
  action: string;
  entityType: string;
  idFrom: AuditIdSource;
  idField?: string;
}

/**
 * Mapeia rotas de mutação (MÉTODO:rota-relativa-ao-controller) para ações de
 * auditoria. A rota é `request.route.path` (sem o prefixo global `api/v1`).
 *
 * - idFrom 'result': o id da entidade vem do corpo da resposta (campo `id`).
 * - idFrom 'body': vem do corpo da requisição (idField).
 * - idFrom 'param': vem dos parâmetros da rota (idField).
 */
export const AUDIT_ROUTE_MAP: Record<string, IAuditRouteConfig> = {
  'POST:/quotes': { action: 'CREATE_QUOTE', entityType: 'Quote', idFrom: 'result' },
  'POST:/quotes/:quoteId/calculate': {
    action: 'CALCULATE_QUOTE',
    entityType: 'QuoteVersion',
    idFrom: 'result',
  },
  'POST:/quotes/send': { action: 'SEND_QUOTE', entityType: 'Quote', idFrom: 'body', idField: 'quoteId' },
  'POST:/quotes/customer-approve': {
    action: 'CUSTOMER_APPROVE_QUOTE',
    entityType: 'Quote',
    idFrom: 'body',
    idField: 'quoteId',
  },
  'POST:/quotes/reopen': { action: 'REOPEN_QUOTE', entityType: 'Quote', idFrom: 'body', idField: 'quoteId' },

  'POST:/configurations': {
    action: 'CREATE_CONFIGURATION',
    entityType: 'Configuration',
    idFrom: 'result',
  },
  'POST:/configurations/submit-for-review': {
    action: 'SUBMIT_CONFIGURATION',
    entityType: 'ConfigurationSnapshot',
    idFrom: 'result',
  },

  'POST:/bom/versions': { action: 'CREATE_BOM_VERSION', entityType: 'BomVersion', idFrom: 'result' },

  'POST:/orders/convert': {
    action: 'CONVERT_QUOTE_TO_ORDER',
    entityType: 'Order',
    idFrom: 'result',
  },
  'POST:/orders/:orderId/advance': {
    action: 'ADVANCE_ORDER',
    entityType: 'Order',
    idFrom: 'param',
    idField: 'orderId',
  },

  'POST:/rules': { action: 'CREATE_RULE', entityType: 'Rule', idFrom: 'result' },
  'POST:/rules/versions': {
    action: 'CREATE_RULE_VERSION',
    entityType: 'RuleVersion',
    idFrom: 'result',
  },
  'POST:/rules/versions/approve': {
    action: 'APPROVE_RULE_VERSION',
    entityType: 'RuleVersion',
    idFrom: 'body',
    idField: 'ruleVersionId',
  },

  'POST:/catalog/component-categories': {
    action: 'CREATE_COMPONENT_CATEGORY',
    entityType: 'ComponentCategory',
    idFrom: 'result',
  },
  'POST:/catalog/components': {
    action: 'CREATE_COMPONENT',
    entityType: 'Component',
    idFrom: 'result',
  },

  'POST:/shipments': { action: 'CREATE_SHIPMENT', entityType: 'Shipment', idFrom: 'result' },
  'POST:/shipments/:shipmentId/shipping-quotes': {
    action: 'ADD_SHIPPING_QUOTE',
    entityType: 'ShippingQuote',
    idFrom: 'result',
  },
  'POST:/shipments/shipping-quotes/select': {
    action: 'SELECT_SHIPPING_QUOTE',
    entityType: 'Shipment',
    idFrom: 'body',
    idField: 'shipmentId',
  },
  'POST:/shipments/:shipmentId/advance': {
    action: 'ADVANCE_SHIPMENT',
    entityType: 'Shipment',
    idFrom: 'param',
    idField: 'shipmentId',
  },
};
