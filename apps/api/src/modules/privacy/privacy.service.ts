import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';

@Injectable()
export class PrivacyService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrivacyConfig(@TenantContext() tenantContext: ITenantContext) {
    const config = await this.prisma.tenantPrivacyConfig.findUnique({
      where: { tenantId: tenantContext.tenantId },
    });
    if (!config) {
      throw new NotFoundException('Privacy config not found');
    }
    return config;
  }

  async updatePrivacyConfig(
    @TenantContext() tenantContext: ITenantContext,
    data: {
      dpoName?: string;
      dpoEmail?: string;
      dpoPhone?: string;
      privacyPolicyUrl?: string;
      dataRetentionDays?: number;
      allowDataSharing?: boolean;
      requireExplicitConsent?: boolean;
      anonymizeOnDeletion?: boolean;
    },
  ) {
    return this.prisma.tenantPrivacyConfig.upsert({
      where: { tenantId: tenantContext.tenantId },
      update: { ...data, privacyPolicyUpdatedAt: data.privacyPolicyUrl ? new Date() : undefined },
      create: {
        tenantId: tenantContext.tenantId,
        dpoName: data.dpoName ?? 'Encarregado de Proteção de Dados',
        dpoEmail: data.dpoEmail,
        dpoPhone: data.dpoPhone,
        privacyPolicyUrl: data.privacyPolicyUrl,
        dataRetentionDays: data.dataRetentionDays ?? 365,
        allowDataSharing: data.allowDataSharing ?? false,
        requireExplicitConsent: data.requireExplicitConsent ?? true,
        anonymizeOnDeletion: data.anonymizeOnDeletion ?? true,
        lgpdComplianceEnabled: true,
        legalBasisDefault: 'LEGITIMATE_INTEREST',
      },
    });
  }

  async grantConsent(
    @TenantContext() tenantContext: ITenantContext,
    data: { userId: string; purpose: string; purposeDescription: string; legalBasis: string; consentVersion?: string },
  ) {
    return this.prisma.consentRecord.create({
      data: {
        tenantId: tenantContext.tenantId,
        userId: data.userId,
        purpose: data.purpose,
        purposeDescription: data.purposeDescription,
        legalBasis: data.legalBasis,
        granted: true,
        grantedAt: new Date(),
        consentVersion: data.consentVersion ?? '1.0',
      },
    });
  }

  async revokeConsent(@TenantContext() tenantContext: ITenantContext, consentId: string) {
    return this.prisma.consentRecord.updateMany({
      where: { id: consentId, tenantId: tenantContext.tenantId },
      data: { granted: false, revokedAt: new Date() },
    });
  }

  async getUserConsents(@TenantContext() tenantContext: ITenantContext, userId: string) {
    return this.prisma.consentRecord.findMany({
      where: { tenantId: tenantContext.tenantId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDataSubjectRequest(
    @TenantContext() tenantContext: ITenantContext,
    data: { userId: string; requestType: string; description?: string },
  ) {
    return this.prisma.dataSubjectRequest.create({
      data: {
        tenantId: tenantContext.tenantId,
        userId: data.userId,
        requestType: data.requestType,
        description: data.description,
        status: 'PENDING',
      },
    });
  }

  async getDataSubjectRequests(@TenantContext() tenantContext: ITenantContext, userId?: string) {
    const where: Prisma.DataSubjectRequestWhereInput = { tenantId: tenantContext.tenantId };
    if (userId) where.userId = userId;
    return this.prisma.dataSubjectRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async fulfillDataSubjectRequest(
    @TenantContext() tenantContext: ITenantContext,
    requestId: string,
    data: { status: string; responseNotes?: string },
  ) {
    return this.prisma.dataSubjectRequest.updateMany({
      where: { id: requestId, tenantId: tenantContext.tenantId },
      data: { status: data.status, responseNotes: data.responseNotes, fulfilledAt: new Date() },
    });
  }

  async exportUserData(@TenantContext() tenantContext: ITenantContext, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { tenantId: tenantContext.tenantId },
          include: {
            role: true,
            tenant: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const consents = await this.prisma.consentRecord.findMany({
      where: { tenantId: tenantContext.tenantId, userId },
    });

    const requests = await this.prisma.dataSubjectRequest.findMany({
      where: { tenantId: tenantContext.tenantId, userId },
    });

    return {
      personalData: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        isActive: user.isActive,
      },
      memberships: user.memberships.map((m) => ({
        tenant: m.tenant.name,
        role: m.role.name,
        status: m.status,
        joinedAt: m.createdAt,
      })),
      consents,
      dataSubjectRequests: requests,
      exportedAt: new Date().toISOString(),
    };
  }

  async deleteUserData(
    @TenantContext() tenantContext: ITenantContext,
    userId: string,
    anonymize: boolean,
  ) {
    if (anonymize) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${userId}@anonymized.local`,
          firstName: 'Usuário',
          lastName: 'Removido',
          passwordHash: 'ANONYMIZED',
          isActive: false,
        },
      });
    } else {
      await this.prisma.membership.deleteMany({
        where: { tenantId: tenantContext.tenantId, userId },
      });
    }

    await this.prisma.privacyAuditLog.create({
      data: {
        tenantId: tenantContext.tenantId,
        actorUserId: userId,
        action: anonymize ? 'DATA_ANONYMIZED' : 'DATA_DELETED',
        entityType: 'User',
        entityId: userId,
        legalBasis: 'CONSENT_REVOCATION',
      },
    });

    return { success: true, anonymized: anonymize };
  }

  async logPrivacyAction(
    @TenantContext() tenantContext: ITenantContext,
    data: { actorUserId?: string; action: string; entityType: string; entityId?: string; dataFields?: string[]; legalBasis?: string; ipAddress?: string; userAgent?: string },
  ) {
    return this.prisma.privacyAuditLog.create({
      data: {
        tenantId: tenantContext.tenantId,
        actorUserId: data.actorUserId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        dataFields: data.dataFields ?? [],
        legalBasis: data.legalBasis,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getPrivacyAuditLogs(@TenantContext() tenantContext: ITenantContext, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.privacyAuditLog.findMany({
        where: { tenantId: tenantContext.tenantId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.privacyAuditLog.count({ where: { tenantId: tenantContext.tenantId } }),
    ]);

    return { data: logs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
