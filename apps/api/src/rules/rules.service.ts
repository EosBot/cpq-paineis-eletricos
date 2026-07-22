import { Injectable } from '@nestjs/common';
import {
  RuleStatus,
  RuleVersionStatus,
  type Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { ApproveRuleVersionDto } from './dto/approve-rule-version.dto';
import { CreateRuleDto } from './dto/create-rule.dto';
import { CreateRuleVersionDto } from './dto/create-rule-version.dto';

@Injectable()
export class RulesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRule(tenantContext: ITenantContext, dto: CreateRuleDto) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    return this.prismaService.rule.create({
      data: {
        tenantId: tenantContext.tenantId,
        name: dto.name,
        code: dto.code,
        status: RuleStatus.DRAFT,
        createdByUserId: tenantContext.userId,
      },
    });
  }

  async createRuleVersion(
    tenantContext: ITenantContext,
    dto: CreateRuleVersionDto,
  ) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    const rule = await this.prismaService.rule.findFirstOrThrow({
      where: {
        id: dto.ruleId,
        tenantId: tenantContext.tenantId,
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: 'desc',
          },
          take: 1,
        },
      },
    });

    const nextVersionNumber = (rule.versions[0]?.versionNumber ?? 0) + 1;

    return this.prismaService.ruleVersion.create({
      data: {
        tenantId: tenantContext.tenantId,
        ruleId: rule.id,
        versionNumber: nextVersionNumber,
        status: RuleVersionStatus.DRAFT,
        definition: dto.definition as Prisma.InputJsonValue,
      },
    });
  }

  async approveRuleVersion(
    tenantContext: ITenantContext,
    dto: ApproveRuleVersionDto,
  ) {
    const approverUserId = tenantContext.userId;

    return this.prismaService.$transactionWithRLS(tenantContext.tenantId, async (transaction) => {
      const version = await transaction.ruleVersion.findFirstOrThrow({
        where: {
          id: dto.ruleVersionId,
          tenantId: tenantContext.tenantId,
        },
        include: {
          rule: true,
        },
      });

      await transaction.ruleVersion.updateMany({
        where: {
          ruleId: version.ruleId,
          tenantId: tenantContext.tenantId,
          status: RuleVersionStatus.APPROVED,
        },
        data: {
          status: RuleVersionStatus.SUPERSEDED,
        },
      });

      const approvedVersion = await transaction.ruleVersion.update({
        where: {
          id: version.id,
        },
        data: {
          status: RuleVersionStatus.APPROVED,
          approvedByUserId: approverUserId,
          approvedAt: new Date(),
        },
      });

      await transaction.rule.update({
        where: {
          id: version.ruleId,
        },
        data: {
          status: RuleStatus.ACTIVE,
        },
      });

      return approvedVersion;
    });
  }

  async listRules(tenantContext: ITenantContext) {
    return this.prismaService.rule.findMany({
      where: {
        tenantId: tenantContext.tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        versions: {
          orderBy: {
            versionNumber: 'desc',
          },
        },
      },
    });
  }
}
