import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { PanelBuilderService } from './panel-builder.service';

@Controller('panel-builder')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PanelBuilderController {
  constructor(private readonly panelBuilderService: PanelBuilderService) {}

  @Get('catalog')
  @Roles('admin', 'engineer', 'sales')
  getCatalog(
    @TenantContext() tc: ITenantContext,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.panelBuilderService.getCatalog(tc, {
      categoryCode: category,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Get('categories')
  @Roles('admin', 'engineer', 'sales')
  getCategories(@TenantContext() tc: ITenantContext) {
    return this.panelBuilderService.getCategories(tc);
  }

  @Get('templates')
  @Roles('admin', 'engineer', 'sales')
  getTemplates() {
    return this.panelBuilderService.getPanelTemplates();
  }

  @Get('regions')
  @Roles('admin', 'engineer', 'sales')
  getRegions() {
    return this.panelBuilderService.getRegions();
  }

  @Get('regions/:stateCode')
  @Roles('admin', 'engineer', 'sales')
  getRegion(@Param('stateCode') stateCode: string) {
    return this.panelBuilderService.getRegionByState(stateCode);
  }

  @Get('configurations')
  @Roles('admin', 'engineer', 'sales')
  getConfigurations(@TenantContext() tc: ITenantContext) {
    return this.panelBuilderService.getConfigurations(tc);
  }

  @Get('configurations/:id')
  @Roles('admin', 'engineer', 'sales')
  getConfiguration(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.panelBuilderService.getConfiguration(tc, id);
  }

  @Post('configurations')
  @Roles('admin', 'engineer')
  createConfiguration(@TenantContext() tc: ITenantContext, @Body() data: any) {
    return this.panelBuilderService.createConfiguration(tc, data);
  }

  @Post('configurations/:id/rails')
  @Roles('admin', 'engineer')
  addRail(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() data: any) {
    return this.panelBuilderService.addRail(tc, id, data);
  }

  @Post('configurations/:id/circuits')
  @Roles('admin', 'engineer')
  addCircuit(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() data: any) {
    return this.panelBuilderService.addCircuit(tc, id, data);
  }

  @Post('configurations/:id/placements')
  @Roles('admin', 'engineer')
  addPlacement(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() data: any) {
    return this.panelBuilderService.addPlacement(tc, id, data);
  }

  @Delete('placements/:id')
  @Roles('admin', 'engineer')
  removePlacement(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.panelBuilderService.removePlacement(tc, id);
  }

  @Get('configurations/:id/pricing')
  @Roles('admin', 'engineer', 'sales')
  getPricing(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.panelBuilderService.calculatePricing(tc, id);
  }

  @Get('business-rules')
  @Roles('admin', 'engineer', 'sales')
  getBusinessRules(@TenantContext() tc: ITenantContext) {
    return this.panelBuilderService.getBusinessRules(tc);
  }
}
