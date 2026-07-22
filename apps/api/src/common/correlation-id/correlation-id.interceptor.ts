import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'node:crypto';
import { runWithCorrelationId } from './correlation-id.storage';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

interface IHttpRequest {
  headers: Record<string, string | undefined>;
}

interface IHttpResponse {
  setHeader(name: string, value: string): void;
}

/**
 * Garante um correlation-id por requisição:
 * - reutiliza o header X-Correlation-ID recebido (propagação entre serviços);
 * - gera UUID v4 quando ausente;
 * - reflete o valor no response header;
 * - disponibiliza o valor via AsyncLocalStorage para logs e auditoria.
 */
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  private static readonly SAFE_ID_PATTERN = /^[a-zA-Z0-9\-_]{1,128}$/;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<IHttpRequest>();
    const response = http.getResponse<IHttpResponse>();

    const incoming = request.headers?.[CORRELATION_ID_HEADER];
    const correlationId =
      typeof incoming === 'string' && CorrelationIdInterceptor.SAFE_ID_PATTERN.test(incoming)
        ? incoming
        : randomUUID();

    response.setHeader(CORRELATION_ID_HEADER, correlationId);

    return new Observable((subscriber) => {
      runWithCorrelationId(correlationId, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
