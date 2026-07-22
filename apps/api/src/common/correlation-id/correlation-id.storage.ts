import { AsyncLocalStorage } from 'node:async_hooks';

const correlationIdStorage = new AsyncLocalStorage<string>();

export function runWithCorrelationId<T>(
  correlationId: string,
  callback: () => T,
): T {
  return correlationIdStorage.run(correlationId, callback);
}

export function getCorrelationIdFromStorage(): string | undefined {
  return correlationIdStorage.getStore();
}
