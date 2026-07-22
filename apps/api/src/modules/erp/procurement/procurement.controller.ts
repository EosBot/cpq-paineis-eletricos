import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PurchaseOrderStatus } from '@prisma/client';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { ProcurementService } from './procurement.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Controller('erp/procurement')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Post('suppliers')
  @Roles('admin', 'engineer')
  createSupplier(@TenantContext() tc: ITenantContext, @Body() dto: CreateSupplierDto) {
    return this.procurementService.createSupplier(tc.tenantId, dto);
  }

  @Get('suppliers')
  @Roles('admin', 'engineer', 'sales')
  listSuppliers(@TenantContext() tc: ITenantContext) {
    return this.procurementService.listSuppliers(tc.tenantId);
  }

  @Post('purchase-orders')
  @Roles('admin', 'engineer')
  createPurchaseOrder(@TenantContext() tc: ITenantContext, @Body() dto: CreatePurchaseOrderDto) {
    return this.procurementService.createPurchaseOrder(tc.tenantId, dto);
  }

  @Get('purchase-orders')
  @Roles('admin', 'engineer', 'sales')
  listPurchaseOrders(
    @TenantContext() tc: ITenantContext,
    @Query('status') status?: PurchaseOrderStatus,
  ) {
    return this.procurementService.listPurchaseOrders(tc.tenantId, status);
  }

  @Patch('purchase-orders/:id/receive')
  @Roles('admin', 'engineer')
  receiveOrder(
    @TenantContext() tc: ITenantContext,
    @Param('id') id: string,
    @Query('locationId') locationId: string,
  ) {
    return this.procurementService.receiveOrder(tc.tenantId, id, locationId);
  }
}
