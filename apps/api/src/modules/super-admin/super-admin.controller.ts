import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminGuard } from './super-admin.guard';

@Controller('super-admin')
@UseGuards(AuthGuard('jwt'), SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  getStats() {
    return this.superAdminService.getPlatformStats();
  }

  @Get('tenants')
  getTenants(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.superAdminService.getTenants(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('tenants/:id')
  getTenantDetails(@Param('id') id: string) {
    return this.superAdminService.getTenantDetails(id);
  }

  @Post('tenants')
  createTenant(@Body() data: { name: string; slug: string; defaultCurrency?: string }) {
    return this.superAdminService.createTenant(data);
  }

  @Patch('tenants/:id/toggle-active')
  toggleTenantActive(@Param('id') id: string, @Body() data: { isActive: boolean }) {
    return this.superAdminService.toggleTenantActive(id, data.isActive);
  }

  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.superAdminService.getUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Patch('users/:id/toggle-active')
  toggleUserActive(@Param('id') id: string, @Body() data: { isActive: boolean }) {
    return this.superAdminService.toggleUserActive(id, data.isActive);
  }
}
