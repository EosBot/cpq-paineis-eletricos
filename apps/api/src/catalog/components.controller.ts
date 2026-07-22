import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { CatalogService } from './catalog.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('catalog/components')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ComponentsController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @Roles('admin', 'engineer')
  create(@TenantContext() tenantContext: ITenantContext, @Body() dto: CreateComponentDto) {
    return this.catalogService.createComponent(tenantContext, dto);
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  list(@TenantContext() tenantContext: ITenantContext) {
    return this.catalogService.listComponents(tenantContext);
  }
}
