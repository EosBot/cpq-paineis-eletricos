import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { SubmitConfigurationForReviewDto } from './dto/submit-configuration-for-review.dto';

@Controller('configurations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post()
  @Roles('admin', 'engineer')
  create(@TenantContext() tenantContext: ITenantContext, @Body() dto: CreateConfigurationDto) {
    return this.configurationsService.createConfiguration(tenantContext, dto);
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  list(@TenantContext() tenantContext: ITenantContext) {
    return this.configurationsService.listConfigurations(tenantContext);
  }

  @Post('submit-for-review')
  @Roles('admin', 'engineer')
  submitForReview(
    @TenantContext() tenantContext: ITenantContext,
    @Body() dto: SubmitConfigurationForReviewDto,
  ) {
    return this.configurationsService.submitForInternalReview(tenantContext, dto);
  }
}
