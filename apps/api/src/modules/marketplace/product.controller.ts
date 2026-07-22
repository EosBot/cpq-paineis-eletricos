import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/marketplace.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles('admin', 'engineer', 'sales')
  getCatalog(
    @TenantContext() tc: ITenantContext,
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productService.getCatalog(tc, {
      categoryId,
      type,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':slug')
  @Roles('admin', 'engineer', 'sales')
  getBySlug(@TenantContext() tc: ITenantContext, @Param('slug') slug: string) {
    return this.productService.getBySlug(tc, slug);
  }

  @Post()
  @Roles('admin')
  create(@TenantContext() tc: ITenantContext, @Body() dto: CreateProductDto) {
    return this.productService.create(tc, dto);
  }

  @Patch(':id')
  @Roles('admin')
  update(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(tc, id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.productService.remove(tc, id);
  }
}
