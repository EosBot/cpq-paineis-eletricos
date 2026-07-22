import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { IncomingMessage } from 'node:http';
import { BillingService } from './billing.service';

class CreateCheckoutSessionDto {
  customerEmail!: string;
  customerName!: string;
  planPriceId!: string;
  tenantId!: string;
}

class CreatePortalSessionDto {
  tenantId!: string;
  customerId!: string;
}

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout-session')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession({
      tenantId: dto.tenantId,
      customerEmail: dto.customerEmail,
      customerName: dto.customerName,
      planPriceId: dto.planPriceId,
    });
  }

  @Post('portal-session')
  createPortalSession(@Body() dto: CreatePortalSessionDto) {
    return this.billingService.createPortalSession({
      tenantId: dto.tenantId,
      customerId: dto.customerId,
    });
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  async handleWebhook(@Req() req: RawBodyRequest<IncomingMessage>) {
    const signature = (req.headers['stripe-signature'] as string) ?? '';
    const payload = req.rawBody;

    if (!payload) {
      throw new BadRequestException('Missing raw body for webhook verification.');
    }

    await this.billingService.handleWebhook(payload, signature);

    return { received: true };
  }
}
