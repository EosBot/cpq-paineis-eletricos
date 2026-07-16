import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
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
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateShipmentDto,
  ) {
    return this.shipmentsService.createShipment(createTenantContext(tenantId, userId), dto);
  }

  @Post(':shipmentId/shipping-quotes')
  @Roles('admin', 'sales')
  addShippingQuote(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('shipmentId') shipmentId: string,
    @Body() dto: AddShippingQuoteDto,
  ) {
    return this.shipmentsService.addShippingQuote(createTenantContext(tenantId, userId), {
      ...dto,
      shipmentId,
    });
  }

  @Post('shipping-quotes/select')
  @Roles('admin', 'sales')
  selectShippingQuote(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: SelectShippingQuoteDto,
  ) {
    return this.shipmentsService.selectShippingQuote(
      createTenantContext(tenantId, userId),
      dto,
    );
  }

  @Post(':shipmentId/advance')
  @Roles('admin')
  advance(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('shipmentId') shipmentId: string,
    @Body() dto: AdvanceShipmentDto,
  ) {
    return this.shipmentsService.advanceShipment(createTenantContext(tenantId, userId), {
      ...dto,
      shipmentId,
    });
  }

  @Get()
  @Roles('admin', 'sales')
  list(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string) {
    return this.shipmentsService.listShipments(createTenantContext(tenantId, userId));
  }

  @Get(':shipmentId')
  @Roles('admin', 'sales')
  get(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('shipmentId') shipmentId: string,
  ) {
    return this.shipmentsService.getShipment(createTenantContext(tenantId, userId), shipmentId);
  }
}
