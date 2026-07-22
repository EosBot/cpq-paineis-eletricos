import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { SubscriptionService } from './subscription.service';

class CreateSubscriptionDto {
  planId!: string;
  stripeCustomerId?: string;
  trialDays?: number;
  billingPeriod?: 'MONTHLY' | 'YEARLY';
}

class ChangePlanDto {
  planId!: string;
  billingPeriod?: 'MONTHLY' | 'YEARLY';
}

class SubscriptionQueryDto {
  tenantId!: string;
}

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.create({
      tenantId: dto.planId,
      planId: dto.planId,
      stripeCustomerId: dto.stripeCustomerId,
      trialDays: dto.trialDays,
      billingPeriod: dto.billingPeriod,
    });
  }

  @Get('current')
  findCurrent(@Query('tenantId') tenantId: string) {
    return this.subscriptionService.findCurrent(tenantId);
  }

  @Get(':tenantId')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.subscriptionService.findCurrent(tenantId);
  }

  @Patch('change-plan')
  changePlan(@Query('tenantId') tenantId: string, @Body() dto: ChangePlanDto) {
    return this.subscriptionService.changePlan(
      tenantId,
      dto.planId,
      dto.billingPeriod,
    );
  }

  @Post('cancel')
  cancel(@Query('tenantId') tenantId: string) {
    return this.subscriptionService.cancel(tenantId);
  }

  @Post('reactivate')
  reactivate(@Query('tenantId') tenantId: string) {
    return this.subscriptionService.reactivate(tenantId);
  }
}
