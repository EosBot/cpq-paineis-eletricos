import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/marketplace.dto';

@Controller('customers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Roles('admin', 'engineer', 'sales')
  getCustomers(
    @TenantContext() tc: ITenantContext,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.customerService.getCustomers(tc, {
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  @Roles('admin', 'engineer', 'sales')
  getById(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.customerService.getById(tc, id);
  }

  @Post()
  @Roles('admin', 'sales')
  create(@TenantContext() tc: ITenantContext, @Body() dto: CreateCustomerDto) {
    return this.customerService.create(tc, dto);
  }

  @Post('register')
  register(@Body() dto: CreateCustomerDto, @Query('tenantId') tenantId: string) {
    return this.customerService.register(dto, tenantId);
  }

  @Patch(':id')
  @Roles('admin', 'sales')
  update(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() dto: Partial<CreateCustomerDto>) {
    return this.customerService.update(tc, id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.customerService.remove(tc, id);
  }
}
