import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { SubmitConfigurationForReviewDto } from './dto/submit-configuration-for-review.dto';

@Controller('configurations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post()
  @Roles('admin', 'engineer')
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateConfigurationDto,
  ) {
    return this.configurationsService.createConfiguration(
      createTenantContext(tenantId, userId),
      dto,
    );
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  list(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.configurationsService.listConfigurations(
      createTenantContext(tenantId, userId),
    );
  }

  @Post('submit-for-review')
  @Roles('admin', 'engineer')
  submitForReview(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: SubmitConfigurationForReviewDto,
  ) {
    return this.configurationsService.submitForInternalReview(
      createTenantContext(tenantId, userId),
      dto,
    );
  }
}
