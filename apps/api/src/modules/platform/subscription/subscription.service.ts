import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BillingPeriod,
  Plan,
  Prisma,
  Subscription,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PlanService } from '../plan/plan.service';

export interface CreateSubscriptionInput {
  tenantId: string;
  planId: string;
  stripeCustomerId?: string;
  trialDays?: number;
  billingPeriod?: BillingPeriod;
}

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planService: PlanService,
  ) {}

  async create(input: CreateSubscriptionInput): Promise<Subscription> {
    const existing = await this.prisma.subscription.findUnique({
      where: { tenantId: input.tenantId },
    });

    if (existing && existing.status !== SubscriptionStatus.CANCELED) {
      throw new BadRequestException('Tenant already has an active subscription.');
    }

    const plan = await this.planService.findOne(input.planId);
    const trialDays = input.trialDays ?? 14;

    return this.prisma.subscription.create({
      data: {
        tenantId: input.tenantId,
        planId: plan.id,
        stripeCustomerId: input.stripeCustomerId,
        status: SubscriptionStatus.TRIALING,
        billingPeriod: input.billingPeriod ?? BillingPeriod.MONTHLY,
        trialStart: new Date(),
        trialEnd: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
      },
    });
  }

  async findCurrent(tenantId: string): Promise<
    Subscription & {
      plan: Plan;
      isInTrial: boolean;
      isExpired: boolean;
      daysRemaining: number | null;
    }
  > {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found.');
    }

    const now = new Date();
    const isInTrial =
      subscription.status === SubscriptionStatus.TRIALING &&
      subscription.trialEnd !== null &&
      subscription.trialEnd > now;

    const currentEnd = subscription.currentPeriodEnd ?? subscription.trialEnd;
    const isExpired = currentEnd !== null && currentEnd < now;
    const daysRemaining = currentEnd
      ? Math.max(0, Math.ceil((currentEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    return {
      ...subscription,
      isInTrial,
      isExpired,
      daysRemaining,
    };
  }

  async changePlan(
    tenantId: string,
    newPlanId: string,
    billingPeriod?: BillingPeriod,
  ): Promise<Subscription> {
    const current = await this.getCurrentSubscription(tenantId);
    await this.planService.findOne(newPlanId);

    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        planId: newPlanId,
        ...(billingPeriod ? { billingPeriod } : {}),
      },
    });
  }

  async cancel(tenantId: string): Promise<Subscription> {
    const current = await this.getCurrentSubscription(tenantId);

    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        cancelAtPeriodEnd: true,
      },
    });
  }

  async reactivate(tenantId: string): Promise<Subscription> {
    const current = await this.getCurrentSubscription(tenantId);

    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        cancelAtPeriodEnd: false,
      },
    });
  }

  async updateFromStripe(data: {
    stripeSubscriptionId: string;
    status: SubscriptionStatus;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: data.stripeSubscriptionId },
    });

    if (!subscription) return null;

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      },
    });
  }

  async attachStripeIds(
    tenantId: string,
    stripeSubscriptionId: string,
    stripeCustomerId?: string,
  ): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { tenantId },
      data: {
        stripeSubscriptionId,
        ...(stripeCustomerId ? { stripeCustomerId } : {}),
      },
    });
  }

  private async getCurrentSubscription(tenantId: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found.');
    }

    return subscription;
  }
}
