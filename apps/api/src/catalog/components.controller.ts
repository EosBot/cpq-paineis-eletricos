import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { CatalogService } from './catalog.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('catalog/components')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ComponentsController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @Roles('admin', 'engineer')
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateComponentDto,
  ) {
    return this.catalogService.createComponent(
      createTenantContext(tenantId, userId),
      dto,
    );
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  list(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string) {
    return this.catalogService.listComponents(createTenantContext(tenantId, userId));
  }
}
