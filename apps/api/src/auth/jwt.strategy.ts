import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface IJwtPayload {
  sub: string;
  tenantId: string;
  membershipId: string;
  roleCode: string;
  permissions: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_SECRET',
        'change-me-access',
      ),
    });
  }

  validate(payload: IJwtPayload) {
    return {
      userId: payload.sub,
      tenantId: payload.tenantId,
      membershipId: payload.membershipId,
      roleCode: payload.roleCode,
      permissions: payload.permissions,
    };
  }
}
