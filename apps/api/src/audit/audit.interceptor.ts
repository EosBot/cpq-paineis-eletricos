import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { StructuredLogger } from '../common/logging/structured.logger';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { getCorrelationIdFromStorage } from '../common/correlation-id/correlation-id.storage';
import { AUDIT_ROUTE_MAP, type IAuditRouteConfig } from './audit-route-map';

const GLOBAL_PREFIX = '/api/v1';

interface IAuditRequest {
  method: string;
  url?: string;
  route?: { path?: string };
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  ip?: string;
  headers?: Record<string, string | undefined>;
}

/**
 * Interceptor global de auditoria. Registra, de forma assíncrona e
 * fire-and-forget, as mutações mapeadas em AUDIT_ROUTE_MAP.
 *
 * - Não audita rotas GET nem rotas fora do mapa.
 * - Não audita requisições sem contexto de tenant (ex.: login).
 * - Falhas de escrita são logadas, nunca quebram a resposta.
 *
 * A resolução da rota é feita de forma defensiva: prioriza
 * `request.route.path` (padrão do Express) e, caso ausente, deriva o
 * caminho a partir de `request.url`. Em ambos os casos o prefixo global
 * `/api/v1` é removido, pois o mapa de auditoria usa caminhos relativos.
 * Rotas com parâmetros (ex.: `/quotes/:quoteId/calculate`) são casadas
 * tanto pelo padrão exato quanto por comparação segmento-a-segmento.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new StructuredLogger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<IAuditRequest>();
    const routePath = this.resolveRoutePath(request);
    const config = this.matchAuditConfig(request.method, routePath);

    if (!config) {
      return next.handle();
    }

    const tenantContext = getTenantContextFromStorage();
    if (!tenantContext) {
      return next.handle();
    }

    const correlationId = getCorrelationIdFromStorage() ?? null;

    return next.handle().pipe(
      tap({
        next: (result) => {
          void this.persist(config, request, tenantContext, correlationId, result).catch(
            (error: unknown) => {
              this.logger.error('Falha ao persistir registro de auditoria', { error });
            },
          );
        },
      }),
    );
  }

  /**
   * Resolve o caminho da rota sem o prefixo global.
   * `request.route.path` é o caminho Express (pode vir com ou sem prefixo,
   * dependendo de como o Nest registra a rota); `request.url` também pode
   * conter o prefixo. Em ambos os casos removemos `/api/v1` para casar
   * com as chaves de AUDIT_ROUTE_MAP.
   */
  private resolveRoutePath(request: IAuditRequest): string {
    const raw = request.route?.path ?? request.url ?? '/';
    const pathOnly = raw.split('?')[0] ?? '/';
    if (pathOnly.startsWith(GLOBAL_PREFIX)) {
      return pathOnly.slice(GLOBAL_PREFIX.length) || '/';
    }
    return pathOnly;
  }

  /**
   * Casa o método + caminho contra AUDIT_ROUTE_MAP, suportando rotas com
   * parâmetros (segmentos iniciados por `:`).
   */
  private matchAuditConfig(method: string, path: string): IAuditRouteConfig | undefined {
    const key = `${method.toUpperCase()}:${path}`;
    const exact = AUDIT_ROUTE_MAP[key];
    if (exact) {
      return exact;
    }

    for (const [mapKey, candidate] of Object.entries(AUDIT_ROUTE_MAP)) {
      const separatorIndex = mapKey.indexOf(':');
      if (separatorIndex === -1) {
        continue;
      }
      const mapMethod = mapKey.slice(0, separatorIndex);
      const mapPattern = mapKey.slice(separatorIndex + 1);
      if (mapMethod !== method.toUpperCase()) {
        continue;
      }
      if (this.matchPattern(mapPattern, path)) {
        return candidate;
      }
    }

    return undefined;
  }

  private matchPattern(pattern: string, actual: string): boolean {
    const patternSegments = pattern.split('/');
    const actualSegments = actual.split('/');
    if (patternSegments.length !== actualSegments.length) {
      return false;
    }
    return patternSegments.every(
      (segment, index) => segment.startsWith(':') || segment === actualSegments[index],
    );
  }

  private resolveEntityId(
    config: IAuditRouteConfig,
    request: IAuditRequest,
    result: unknown,
  ): string | null {
    switch (config.idFrom) {
      case 'result':
        return (result as { id?: string } | null)?.id ?? null;
      case 'body':
        return (request.body?.[config.idField as string] as string | undefined) ?? null;
      case 'param':
        return (request.params?.[config.idField as string] as string | undefined) ?? null;
      default:
        return null;
    }
  }

  private sanitizeHeader(value: string | undefined): string | null {
    if (!value) return null;
    return value.replace(/[^\x20-\x7E]/g, '').slice(0, 512) || null;
  }

  private async persist(
    config: IAuditRouteConfig,
    request: IAuditRequest,
    tenantContext: { tenantId: string; userId: string },
    correlationId: string | null,
    result: unknown,
  ): Promise<void> {
    const entityId = this.resolveEntityId(config, request, result);
    await this.prisma.setTenantContext(tenantContext.tenantId);
    await this.prisma.auditLog.create({
      data: {
        tenantId: tenantContext.tenantId,
        actorUserId: tenantContext.userId,
        action: config.action,
        entityType: config.entityType,
        entityId,
        correlationId,
        ipAddress: this.sanitizeHeader(request.ip),
        userAgent: this.sanitizeHeader(request.headers?.['user-agent']),
      },
    });
  }
}
