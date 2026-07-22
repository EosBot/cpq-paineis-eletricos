import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

interface IRequestUser {
  roleCode?: string;
}

interface IRequestWithUser {
  user?: IRequestUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('Role-based access control is required but no roles were specified.');
    }

    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    const roleCode = request.user?.roleCode;

    if (!roleCode) {
      throw new UnauthorizedException('Role context is required.');
    }

    if (!requiredRoles.includes(roleCode)) {
      throw new ForbiddenException('Insufficient permissions to access this resource.');
    }

    return true;
  }
}
