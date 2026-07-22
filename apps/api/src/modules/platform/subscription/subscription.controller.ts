import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { SubscriptionService } from './subscription.service';

class CreateSubscriptionDto {
  @IsString()
  planId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  stripeCustomerId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  trialDays?: number;

  @IsOptional()
  @IsEnum(['MONTHLY', 'YEARLY'])
  billingPeriod?: 'MONTHLY' | 'YEARLY';
}

class ChangePlanDto {
  @IsString()
  planId!: string;

  @IsOptional()
  @IsEnum(['MONTHLY', 'YEARLY'])
  billingPeriod?: 'MONTHLY' | 'YEARLY';
}

@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Roles('admin')
  create(@TenantContext() tc: ITenantContext, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.create({
      tenantId: tc.tenantId,
      planId: dto.planId,
      stripeCustomerId: dto.stripeCustomerId,
      trialDays: dto.trialDays,
      billingPeriod: dto.billingPeriod,
    });
  }

  @Get('current')
  @Roles('admin', 'engineer', 'sales')
  findCurrent(@TenantContext() tc: ITenantContext) {
    return this.subscriptionService.findCurrent(tc.tenantId);
  }

  @Get(':tenantId')
  @Roles('admin')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.subscriptionService.findCurrent(tenantId);
  }

  @Patch('change-plan')
  @Roles('admin')
  changePlan(@TenantContext() tc: ITenantContext, @Body() dto: ChangePlanDto) {
    return this.subscriptionService.changePlan(
      tc.tenantId,
      dto.planId,
      dto.billingPeriod,
    );
  }

  @Post('cancel')
  @Roles('admin')
  cancel(@TenantContext() tc: ITenantContext) {
    return this.subscriptionService.cancel(tc.tenantId);
  }

  @Post('reactivate')
  @Roles('admin')
  reactivate(@TenantContext() tc: ITenantContext) {
    return this.subscriptionService.reactivate(tc.tenantId);
  }
}
