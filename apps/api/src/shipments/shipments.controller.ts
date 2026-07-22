import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { AddShippingQuoteDto } from './dto/add-shipping-quote.dto';
import { AdvanceShipmentDto } from './dto/advance-shipment.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { SelectShippingQuoteDto } from './dto/select-shipping-quote.dto';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  @Roles('admin', 'sales')
  create(@TenantContext() tenantContext: ITenantContext, @Body() dto: CreateShipmentDto) {
    return this.shipmentsService.createShipment(tenantContext, dto);
  }

  @Post(':shipmentId/shipping-quotes')
  @Roles('admin', 'sales')
  addShippingQuote(
    @TenantContext() tenantContext: ITenantContext,
    @Param('shipmentId') shipmentId: string,
    @Body() dto: AddShippingQuoteDto,
  ) {
    return this.shipmentsService.addShippingQuote(tenantContext, {
      ...dto,
      shipmentId,
    });
  }

  @Post('shipping-quotes/select')
  @Roles('admin', 'sales')
  selectShippingQuote(
    @TenantContext() tenantContext: ITenantContext,
    @Body() dto: SelectShippingQuoteDto,
  ) {
    return this.shipmentsService.selectShippingQuote(tenantContext, dto);
  }

  @Post(':shipmentId/advance')
  @Roles('admin')
  advance(
    @TenantContext() tenantContext: ITenantContext,
    @Param('shipmentId') shipmentId: string,
    @Body() dto: AdvanceShipmentDto,
  ) {
    return this.shipmentsService.advanceShipment(tenantContext, {
      ...dto,
      shipmentId,
    });
  }

  @Get()
  @Roles('admin', 'sales')
  list(@TenantContext() tenantContext: ITenantContext) {
    return this.shipmentsService.listShipments(tenantContext);
  }

  @Get(':shipmentId')
  @Roles('admin', 'sales')
  get(@TenantContext() tenantContext: ITenantContext, @Param('shipmentId') shipmentId: string) {
    return this.shipmentsService.getShipment(tenantContext, shipmentId);
  }
}
