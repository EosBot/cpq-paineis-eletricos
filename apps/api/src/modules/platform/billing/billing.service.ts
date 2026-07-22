import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SubscriptionService } from '../subscription/subscription.service';
import { StripeService } from './stripe.service';
import { SubscriptionStatus } from '@prisma/client';

type StripeSubscriptionWithPeriod = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
};

type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription;
};

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  async createCheckoutSession(params: {
    tenantId: string;
    customerEmail: string;
    customerName: string;
    planPriceId: string;
  }): Promise<{ sessionId: string; url: string }> {
    const customer = await this.stripeService.createCustomer({
      email: params.customerEmail,
      name: params.customerName,
      metadata: { tenantId: params.tenantId },
    });

    const successUrl =
      this.configService.get('STRIPE_SUCCESS_URL');
    const cancelUrl =
      this.configService.get('STRIPE_CANCEL_URL');

    if (!successUrl || !cancelUrl) {
      throw new Error('STRIPE_SUCCESS_URL and STRIPE_CANCEL_URL must be configured.');
    }

    const session = await this.stripeService.createCheckoutSession({
      customerId: customer.id,
      priceId: params.planPriceId,
      successUrl,
      cancelUrl,
      metadata: { tenantId: params.tenantId },
    });

    return { sessionId: session.id, url: session.url! };
  }

  async createPortalSession(params: {
    tenantId: string;
    customerId: string;
  }): Promise<{ url: string }> {
    const returnUrl = this.configService.get<string>('STRIPE_RETURN_URL');

    if (!returnUrl) {
      throw new Error('STRIPE_RETURN_URL must be configured.');
    }

    const session = await this.stripeService.createPortalSession({
      customerId: params.customerId,
      returnUrl,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = await this.stripeService.constructEvent(payload, signature);
    } catch (error) {
      this.logger.error('Webhook signature verification failed.', { error });
      throw new BadRequestException('Invalid webhook signature.');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const tenantId = session.metadata?.tenantId;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (!tenantId || !subscriptionId) {
      this.logger.error('Missing tenantId or subscriptionId in checkout session.');
      return;
    }

    await this.subscriptionService.attachStripeIds(
      tenantId,
      subscriptionId,
      customerId,
    );

    const stripeSub = await this.stripeService.getSubscription(subscriptionId);
    const subWithPeriod = stripeSub as StripeSubscriptionWithPeriod;

    await this.subscriptionService.updateFromStripe({
      stripeSubscriptionId: subscriptionId,
      status: this.mapStripeStatus(stripeSub.status),
      currentPeriodStart: subWithPeriod.current_period_start
        ? new Date(subWithPeriod.current_period_start * 1000)
        : undefined,
      currentPeriodEnd: subWithPeriod.current_period_end
        ? new Date(subWithPeriod.current_period_end * 1000)
        : undefined,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
    });

    this.logger.log(`Checkout completed for tenant ${tenantId}`);
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const subWithPeriod = subscription as StripeSubscriptionWithPeriod;

    await this.subscriptionService.updateFromStripe({
      stripeSubscriptionId: subscription.id,
      status: this.mapStripeStatus(subscription.status),
      currentPeriodStart: subWithPeriod.current_period_start
        ? new Date(subWithPeriod.current_period_start * 1000)
        : undefined,
      currentPeriodEnd: subWithPeriod.current_period_end
        ? new Date(subWithPeriod.current_period_end * 1000)
        : undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
    });

    this.logger.log(`Subscription ${subscription.id} updated.`);
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    await this.subscriptionService.updateFromStripe({
      stripeSubscriptionId: subscription.id,
      status: SubscriptionStatus.CANCELED,
    });

    this.logger.log(`Subscription ${subscription.id} canceled.`);
  }

  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    const invWithSub = invoice as StripeInvoiceWithSubscription;
    const subscriptionId = invWithSub.subscription;
    if (typeof subscriptionId !== 'string') return;

    await this.subscriptionService.updateFromStripe({
      stripeSubscriptionId: subscriptionId,
      status: SubscriptionStatus.PAST_DUE,
    });

    this.logger.warn(`Payment failed for subscription ${subscriptionId}`);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const invWithSub = invoice as StripeInvoiceWithSubscription;
    const subscriptionId = invWithSub.subscription;
    if (typeof subscriptionId !== 'string') return;

    const stripeSub = await this.stripeService.getSubscription(subscriptionId);
    const subWithPeriod = stripeSub as StripeSubscriptionWithPeriod;

    await this.subscriptionService.updateFromStripe({
      stripeSubscriptionId: subscriptionId,
      status: this.mapStripeStatus(stripeSub.status),
      currentPeriodStart: subWithPeriod.current_period_start
        ? new Date(subWithPeriod.current_period_start * 1000)
        : undefined,
      currentPeriodEnd: subWithPeriod.current_period_end
        ? new Date(subWithPeriod.current_period_end * 1000)
        : undefined,
    });

    this.logger.log(`Invoice paid for subscription ${subscriptionId}`);
  }

  private mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    switch (status) {
      case 'trialing':
        return SubscriptionStatus.TRIALING;
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      case 'unpaid':
        return SubscriptionStatus.UNPAID;
      case 'incomplete':
        return SubscriptionStatus.INCOMPLETE;
      case 'incomplete_expired':
        return SubscriptionStatus.INCOMPLETE_EXPIRED;
      case 'paused':
        return SubscriptionStatus.PAUSED;
      default:
        return SubscriptionStatus.INCOMPLETE;
    }
  }
}
