import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type ITenantContext } from './tenant-context';

interface IRequestWithUser {
  user?: {
    userId?: string;
    tenantId?: string;
  };
}

/**
 * Extracts the authenticated tenant context from the JWT payload
 * (populated by JwtStrategy.validate), never from client-supplied headers.
 * This enforces tenant isolation as a security boundary (ADR-0001).
 */
export const TenantContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ITenantContext => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();
    const user = request.user;

    if (!user?.tenantId || !user?.userId) {
      throw new Error('Tenant context is required and must come from the authenticated JWT.');
    }

    return {
      tenantId: user.tenantId,
      userId: user.userId,
    };
  },
);
