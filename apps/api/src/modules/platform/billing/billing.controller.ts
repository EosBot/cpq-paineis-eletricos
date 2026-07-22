import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingMessage } from 'node:http';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { BillingService } from './billing.service';

class CreateCheckoutSessionDto {
  @IsEmail()
  customerEmail!: string;

  @IsString()
  @MaxLength(160)
  customerName!: string;

  @IsString()
  planPriceId!: string;
}

class CreatePortalSessionDto {
  @IsString()
  customerId!: string;
}

@Controller('billing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout-session')
  @Roles('admin')
  createCheckoutSession(@TenantContext() tc: ITenantContext, @Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession({
      tenantId: tc.tenantId,
      customerEmail: dto.customerEmail,
      customerName: dto.customerName,
      planPriceId: dto.planPriceId,
    });
  }

  @Post('portal-session')
  @Roles('admin')
  createPortalSession(@TenantContext() tc: ITenantContext, @Body() dto: CreatePortalSessionDto) {
    return this.billingService.createPortalSession({
      tenantId: tc.tenantId,
      customerId: dto.customerId,
    });
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  async handleWebhook(@Req() req: any) {
    const signature = (req.headers['stripe-signature'] as string) ?? '';
    const payload = req.body ? Buffer.from(JSON.stringify(req.body)) : Buffer.alloc(0);

    await this.billingService.handleWebhook(payload, signature);

    return { received: true };
  }
}
