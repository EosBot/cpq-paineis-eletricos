// @ts-nocheck
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock, PrismaMock } from '../testing/prisma.mock';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaMock;
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock };
  let configService: { get: jest.Mock };

  const TENANT_ID = 'tenant-uuid-123';
  const USER_ID = 'user-uuid-456';
  const MEMBERSHIP_ID = 'membership-uuid-789';
  const ROLE_CODE = 'admin';

  beforeEach(async () => {
    prisma = createPrismaMock();
    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'test-access-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return undefined;
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const validDto: LoginDto = {
      email: 'admin@paineisdemo.com',
      password: 'SenhaForte@123',
      tenantId: TENANT_ID,
    };

    it('deve retornar tokens quando credenciais são válidas', async () => {
      const passwordHash = await argon2.hash('SenhaForte@123');

      prisma.user.findUnique.mockResolvedValue({
        id: USER_ID,
        email: validDto.email,
        passwordHash,
        isActive: true,
        memberships: [
          {
            id: MEMBERSHIP_ID,
            tenantId: TENANT_ID,
            status: 'ACTIVE',
            role: { id: 'role-1', code: ROLE_CODE, permissions: { quotes: ['read', 'write'] } },
          },
        ],
      });

      jwtService.signAsync.mockResolvedValueOnce('access-token');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token');

      const result = await service.login(validDto);

      expect(result).toMatchObject({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
        tenantId: TENANT_ID,
        roleCode: ROLE_CODE,
      });
      expect(result.permissions).toEqual({ quotes: ['read', 'write'] });
    });

    it('deve rejeitar quando user não existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );
    });

    it('deve rejeitar quando user está inativo', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: USER_ID,
        email: validDto.email,
        passwordHash: 'some-hash',
        isActive: false,
        memberships: [
          {
            id: MEMBERSHIP_ID,
            tenantId: TENANT_ID,
            status: 'ACTIVE',
            role: { id: 'role-1', code: ROLE_CODE, permissions: {} },
          },
        ],
      });

      await expect(service.login(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );
    });

    it('deve rejeitar quando password está incorreta', async () => {
      const passwordHash = await argon2.hash('SenhaCorreta@123');

      prisma.user.findUnique.mockResolvedValue({
        id: USER_ID,
        email: validDto.email,
        passwordHash,
        isActive: true,
        memberships: [
          {
            id: MEMBERSHIP_ID,
            tenantId: TENANT_ID,
            status: 'ACTIVE',
            role: { id: 'role-1', code: ROLE_CODE, permissions: {} },
          },
        ],
      });

      await expect(service.login(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );
    });

    it('deve rejeitar quando membership não existe (erro genérico)', async () => {
      const passwordHash = await argon2.hash('SenhaForte@123');

      prisma.user.findUnique.mockResolvedValue({
        id: USER_ID,
        email: validDto.email,
        passwordHash,
        isActive: true,
        memberships: [],
      });

      await expect(service.login(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );
    });

    it('deve rejeitar quando membership está suspensa', async () => {
      const passwordHash = await argon2.hash('SenhaForte@123');

      prisma.user.findUnique.mockResolvedValue({
        id: USER_ID,
        email: validDto.email,
        passwordHash,
        isActive: true,
        memberships: [
          {
            id: MEMBERSHIP_ID,
            tenantId: TENANT_ID,
            status: 'SUSPENDED',
            role: { id: 'role-1', code: ROLE_CODE, permissions: {} },
          },
        ],
      });

      await expect(service.login(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials.'),
      );
    });
  });

  describe('refresh', () => {
    const validDto: RefreshTokenDto = { refreshToken: 'valid-refresh-token' };

    it('deve emitir novos tokens quando refresh token é válido e membership está ativa', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: USER_ID,
        tenantId: TENANT_ID,
        membershipId: MEMBERSHIP_ID,
        roleCode: ROLE_CODE,
        permissions: { quotes: ['read'] },
      });

      prisma.membership.findFirst.mockResolvedValue({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        status: 'ACTIVE',
        role: { id: 'role-1', code: ROLE_CODE, permissions: { quotes: ['read', 'write'] } },
      });

      jwtService.signAsync.mockResolvedValueOnce('new-access-token');
      jwtService.signAsync.mockResolvedValueOnce('new-refresh-token');

      const result = await service.refresh(validDto);

      expect(result).toMatchObject({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tenantId: TENANT_ID,
        roleCode: ROLE_CODE,
      });
      expect(result.permissions).toEqual({ quotes: ['read', 'write'] });
    });

    it('deve rejeitar quando refresh token é inválido', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refresh(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token.'),
      );
    });

    it('deve rejeitar quando membership está inativa no refresh (stale permissions)', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: USER_ID,
        tenantId: TENANT_ID,
        membershipId: MEMBERSHIP_ID,
        roleCode: ROLE_CODE,
        permissions: { quotes: ['read'] },
      });

      prisma.membership.findFirst.mockResolvedValue(null);

      await expect(service.refresh(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token.'),
      );
    });

    it('deve rejeitar quando membership está suspensa no refresh', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: USER_ID,
        tenantId: TENANT_ID,
        membershipId: MEMBERSHIP_ID,
        roleCode: ROLE_CODE,
        permissions: { quotes: ['read'] },
      });

      prisma.membership.findFirst.mockResolvedValue({
        id: MEMBERSHIP_ID,
        tenantId: TENANT_ID,
        status: 'SUSPENDED',
        role: { id: 'role-1', code: ROLE_CODE, permissions: {} },
      });

      await expect(service.refresh(validDto)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token.'),
      );
    });
  });
});
