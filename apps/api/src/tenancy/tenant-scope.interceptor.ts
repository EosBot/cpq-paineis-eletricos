import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { type ITenantContext } from './tenant-context';
import { runWithTenantContext } from './tenant-context.storage';

interface IRequestWithUser {
  user?: {
    userId?: string;
    tenantId?: string;
  };
}

@Injectable()
export class TenantScopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    const user = request.user;

    // Requisições não autenticadas (ex.: /auth/login, /auth/refresh) ainda
    // não possuem usuário derivado do JWT. Deixamos prosseguir SEM contexto
    // de tenant. O acesso a dados tenant-scoped nesses fluxos continua sendo
    // rejeitado pelo middleware do Prisma (fail-closed), preservando o
    // isolamento. O login consulta apenas o modelo User (não tenant-scoped).
    if (!user?.tenantId || !user?.userId) {
      return next.handle();
    }

    const tenantContext: ITenantContext = {
      tenantId: user.tenantId,
      userId: user.userId,
    };

    return new Observable((subscriber) => {
      runWithTenantContext(tenantContext, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
