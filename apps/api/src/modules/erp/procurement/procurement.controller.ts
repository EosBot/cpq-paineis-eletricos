import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PurchaseOrderStatus } from '@prisma/client';
import { ProcurementService } from './procurement.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Controller('erp/procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Post('suppliers')
  createSupplier(@Body() dto: CreateSupplierDto, @Query('tenantId') tenantId: string) {
    return this.procurementService.createSupplier(tenantId, dto);
  }

  @Get('suppliers')
  listSuppliers(@Query('tenantId') tenantId: string) {
    return this.procurementService.listSuppliers(tenantId);
  }

  @Post('purchase-orders')
  createPurchaseOrder(
    @Body() dto: CreatePurchaseOrderDto,
    @Query('tenantId') tenantId: string,
  ) {
    return this.procurementService.createPurchaseOrder(tenantId, dto);
  }

  @Get('purchase-orders')
  listPurchaseOrders(
    @Query('tenantId') tenantId: string,
    @Query('status') status?: PurchaseOrderStatus,
  ) {
    return this.procurementService.listPurchaseOrders(tenantId, status);
  }

  @Patch('purchase-orders/:id/receive')
  receiveOrder(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Query('locationId') locationId: string,
  ) {
    return this.procurementService.receiveOrder(tenantId, id, locationId);
  }
}
