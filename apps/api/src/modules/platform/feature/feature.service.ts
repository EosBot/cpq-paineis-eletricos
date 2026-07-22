import { Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';

export enum FeatureFlag {
  CPQ_BASIC = 'CPQ_BASIC',
  CPQ_VISUAL = 'CPQ_VISUAL',
  CPQ_API = 'CPQ_API',
  ERP_INVENTORY = 'ERP_INVENTORY',
  ERP_SALES = 'ERP_SALES',
  ERP_PROCUREMENT = 'ERP_PROCUREMENT',
  ERP_FISCAL = 'ERP_FISCAL',
  ERP_FINANCIAL = 'ERP_FINANCIAL',
  ERP_HR = 'ERP_HR',
  WHITELABEL = 'WHITELABEL',
  CUSTOM_DOMAIN = 'CUSTOM_DOMAIN',
  API_ACCESS = 'API_ACCESS',
  PRIORITY_SUPPORT = 'PRIORITY_SUPPORT',
}

interface PlanFeatureConfig {
  features: string[];
  limits: {
    users: number | null;
    quotesPerMonth: number | null;
    storageGb: number | null;
  };
}

@Injectable()
export class FeatureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async hasFeature(tenantId: string, feature: FeatureFlag): Promise<boolean> {
    const config = await this.getPlanFeatures(tenantId);
    return config.includes(feature);
  }

  async getPlanFeatures(tenantId: string): Promise<string[]> {
    try {
      const subscription = await this.subscriptionService.findCurrent(tenantId);
      const features = subscription.plan.features as string[];
      return features && features.length > 0 ? features : [FeatureFlag.CPQ_BASIC];
    } catch {
      return [FeatureFlag.CPQ_BASIC];
    }
  }

  async getPlanLimits(tenantId: string): Promise<{
    users: number | null;
    quotesPerMonth: number | null;
    storageGb: number | null;
  }> {
    try {
      const subscription = await this.subscriptionService.findCurrent(tenantId);
      const limits = subscription.plan.limits as Record<string, number | null>;
      return {
        users: limits?.users ?? null,
        quotesPerMonth: limits?.quotesPerMonth ?? null,
        storageGb: limits?.storageGb ?? null,
      };
    } catch {
      return { users: 1, quotesPerMonth: 50, storageGb: 1 };
    }
  }

  async canCreateUser(tenantId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(tenantId);
    const maxUsers = limits.users;
    if (maxUsers === null) return true;

    const current = await this.prisma.membership.count({
      where: { tenantId },
    });
    return current < maxUsers;
  }

  async canCreateQuote(tenantId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(tenantId);
    const maxQuotes = limits.quotesPerMonth;
    if (maxQuotes === null) return true;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const used = await this.prisma.quote.count({
      where: {
        tenantId,
        createdAt: { gte: startOfMonth },
      },
    });
    return used < maxQuotes;
  }

  async getLimits(tenantId: string): Promise<{
    users: { current: number; max: number | null };
    quotesPerMonth: { current: number; max: number | null };
    storageGb: number | null;
    features: string[];
  }> {
    const limits = await this.getPlanLimits(tenantId);
    const features = await this.getPlanFeatures(tenantId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [currentUsers, currentQuotes] = await Promise.all([
      this.prisma.membership.count({ where: { tenantId } }),
      this.prisma.quote.count({
        where: { tenantId, createdAt: { gte: startOfMonth } },
      }),
    ]);

    return {
      users: { current: currentUsers, max: limits.users },
      quotesPerMonth: { current: currentQuotes, max: limits.quotesPerMonth },
      storageGb: limits.storageGb,
      features,
    };
  }

  async isSubscriptionActive(tenantId: string): Promise<boolean> {
    try {
      const subscription = await this.subscriptionService.findCurrent(tenantId);
      return (
        subscription.status === SubscriptionStatus.ACTIVE ||
        subscription.status === SubscriptionStatus.TRIALING
      );
    } catch {
      return false;
    }
  }
}
