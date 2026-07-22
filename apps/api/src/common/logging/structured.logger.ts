import { type LoggerService } from '@nestjs/common';
import { getCorrelationIdFromStorage } from '../correlation-id/correlation-id.storage';
import { getTenantContextFromStorage } from '../../tenancy/tenant-context.storage';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

interface ILogEntry {
  level: LogLevel;
  message: string;
  context: string | null;
  correlationId: string | null;
  tenantId: string | null;
  timestamp: string;
  [key: string]: unknown;
};

export class StructuredLogger implements LoggerService {
  private readonly context: string | null;

  constructor(context?: string) {
    this.context = context ?? null;
  }

  private static formatMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }
    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }

  private static extractMeta(optionalParams: unknown[]): Record<string, unknown> | undefined {
    for (const param of optionalParams) {
      if (param && typeof param === 'object' && !Array.isArray(param)) {
        return param as Record<string, unknown>;
      }
    }
    return undefined;
  }

  private emit(level: LogLevel, message: unknown, meta?: Record<string, unknown>): void {
    const entry: ILogEntry = {
      level,
      message: StructuredLogger.formatMessage(message),
      context: this.context,
      correlationId: getCorrelationIdFromStorage() ?? null,
      tenantId: getTenantContextFromStorage()?.tenantId ?? null,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    process.stdout.write(`${JSON.stringify(entry)}\n`);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.emit('log', message, StructuredLogger.extractMeta(optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.emit('error', message, StructuredLogger.extractMeta(optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.emit('warn', message, StructuredLogger.extractMeta(optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.emit('debug', message, StructuredLogger.extractMeta(optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.emit('verbose', message, StructuredLogger.extractMeta(optionalParams));
  }
}
