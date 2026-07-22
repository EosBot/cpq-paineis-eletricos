import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/marketplace.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles('admin', 'engineer', 'sales')
  getCategories(@TenantContext() tc: ITenantContext) {
    return this.categoryService.getCategories(tc);
  }

  @Post()
  @Roles('admin')
  create(@TenantContext() tc: ITenantContext, @Body() dto: CreateCategoryDto) {
    return this.categoryService.create(tc, dto);
  }

  @Patch(':id')
  @Roles('admin')
  update(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(tc, id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.categoryService.remove(tc, id);
  }
}
