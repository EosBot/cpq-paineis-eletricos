export interface ITenantContext {
  tenantId: string;
  userId: string;
}

export function createTenantContext(
  tenantId: string,
  userId: string,
): ITenantContext {
  return {
    tenantId,
    userId,
  };
}

export function assertTenantContext(
  tenantContext: ITenantContext | null | undefined,
): ITenantContext {
  if (!tenantContext?.tenantId) {
    throw new Error('Tenant context is required.');
  }

  return tenantContext;
}
