import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { ITenantContext } from '../../../tenancy/tenant-context';

@Controller('erp/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products')
  createProduct(@Body() dto: CreateProductDto, @Query('tenantId') tenantId: string) {
    return this.inventoryService.createProduct(tenantId, dto);
  }

  @Get('products')
  listProducts(
    @Query('tenantId') tenantId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.inventoryService.listProducts(tenantId, includeInactive === 'true');
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string, @Query('tenantId') tenantId: string) {
    return this.inventoryService.getProduct(tenantId, id);
  }

  @Post('stock-movements')
  createStockMovement(
    @Body() dto: CreateStockMovementDto,
    @Query('tenantId') tenantId: string,
  ) {
    return this.inventoryService.createStockMovement(tenantId, dto);
  }

  @Get('stock-levels')
  getStockLevels(
    @Query('tenantId') tenantId: string,
    @Query('productId') productId?: string,
  ) {
    return this.inventoryService.getStockLevels(tenantId, productId);
  }
}
