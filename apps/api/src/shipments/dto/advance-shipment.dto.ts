import { IsEnum, IsString } from 'class-validator';
import { ShipmentStatus } from '@prisma/client';

export class AdvanceShipmentDto {
  @IsString()
  shipmentId!: string;

  @IsEnum(ShipmentStatus)
  toStatus!: ShipmentStatus;
}
