import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface IAuthJwtPayload {
  sub: string;
  tenantId: string;
  membershipId: string;
  roleCode: string;
  permissions: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
      include: {
        memberships: {
          where: {
            tenantId: loginDto.tenantId,
            status: 'ACTIVE',
          },
          include: {
            role: true,
          },
          take: 1,
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      loginDto.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const membership = user.memberships[0];

    if (!membership) {
      throw new UnauthorizedException('Membership not found for tenant.');
    }

    const permissions = this.extractPermissions(membership.role.permissions);
    const payload: IAuthJwtPayload = {
      sub: user.id,
      tenantId: membership.tenantId,
      membershipId: membership.id,
      roleCode: membership.role.code,
      permissions,
    };

    return this.issueTokens(payload);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'change-me-refresh',
    );

    let payload: IAuthJwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<IAuthJwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    return this.issueTokens(payload);
  }

  private async issueTokens(payload: IAuthJwtPayload) {
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'change-me-refresh',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      tenantId: payload.tenantId,
      roleCode: payload.roleCode,
      permissions: payload.permissions,
    };
  }

  private extractPermissions(permissions: unknown): unknown {
    if (permissions && typeof permissions === 'object') {
      return permissions;
    }

    return {};
  }
}
