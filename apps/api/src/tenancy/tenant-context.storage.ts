import { AsyncLocalStorage } from 'node:async_hooks';
import { type ITenantContext } from './tenant-context';

const tenantContextStorage = new AsyncLocalStorage<ITenantContext>();

export function runWithTenantContext<T>(
  tenantContext: ITenantContext,
  callback: () => T,
): T {
  return tenantContextStorage.run(tenantContext, callback);
}

export function getTenantContextFromStorage(): ITenantContext | undefined {
  return tenantContextStorage.getStore();
}
