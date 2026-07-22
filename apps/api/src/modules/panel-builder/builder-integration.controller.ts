import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { BuilderIntegrationService } from './builder-integration.service';

@Controller('panel-builder/integration')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BuilderIntegrationController {
  constructor(private readonly integrationService: BuilderIntegrationService) {}

  @Post('submit-to-quote')
  @Roles('admin', 'engineer')
  submitToQuote(
    @TenantContext() tc: ITenantContext,
    @Body() data: { configurationId: string; customerAccountId: string; quoteTitle: string },
  ) {
    return this.integrationService.convertBuilderToConfiguration(tc, data);
  }

  @Post('configurations/:id/submit-for-review')
  @Roles('admin', 'engineer')
  submitForReview(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.integrationService.submitConfigurationForReview(tc, id);
  }

  @Get('quotes/:id')
  @Roles('admin', 'engineer', 'sales')
  getQuoteWithConfiguration(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.integrationService.getQuoteWithConfiguration(tc, id);
  }
}
