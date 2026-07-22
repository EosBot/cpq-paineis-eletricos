import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';

@Controller('erp/inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products')
  @Roles('admin', 'engineer')
  createProduct(@TenantContext() tc: ITenantContext, @Body() dto: CreateProductDto) {
    return this.inventoryService.createProduct(tc.tenantId, dto);
  }

  @Get('products')
  @Roles('admin', 'engineer', 'sales')
  listProducts(
    @TenantContext() tc: ITenantContext,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.inventoryService.listProducts(tc.tenantId, includeInactive === 'true');
  }

  @Get('products/:id')
  @Roles('admin', 'engineer', 'sales')
  getProduct(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.inventoryService.getProduct(tc.tenantId, id);
  }

  @Post('stock-movements')
  @Roles('admin', 'engineer')
  createStockMovement(@TenantContext() tc: ITenantContext, @Body() dto: CreateStockMovementDto) {
    return this.inventoryService.createStockMovement(tc.tenantId, dto);
  }

  @Get('stock-levels')
  @Roles('admin', 'engineer', 'sales')
  getStockLevels(
    @TenantContext() tc: ITenantContext,
    @Query('productId') productId?: string,
  ) {
    return this.inventoryService.getStockLevels(tc.tenantId, productId);
  }
}
