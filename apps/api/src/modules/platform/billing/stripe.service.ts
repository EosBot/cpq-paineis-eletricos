import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private _stripe: Stripe | null = null;
  private _apiKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this._apiKey = this.configService.get<string>('STRIPE_SECRET_KEY', '');
    if (!this._apiKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured. Stripe features disabled.');
    }
  }

  private get stripe(): Stripe {
    if (!this._stripe) {
      if (!this._apiKey) {
        throw new Error(
          'STRIPE_SECRET_KEY is not configured. Set STRIPE_SECRET_KEY to enable billing.',
        );
      }
      this._stripe = new Stripe(this._apiKey);
    }
    return this._stripe;
  }

  isConfigured(): boolean {
    return !!this._apiKey;
  }

  async createCustomer(params: {
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    });
  }

  async createCheckoutSession(params: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
    trialDays?: number;
  }): Promise<Stripe.Checkout.Session> {
    const trialDays = params.trialDays ?? this.configService.get<number>('STRIPE_TRIAL_DAYS') ?? 14;

    return this.stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: 'subscription',
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      subscription_data: {
        trial_period_days: trialDays,
      },
    });
  }

  async createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    return this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  async getSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async constructEvent(
    payload: Buffer | string,
    signature: string,
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
    }
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
