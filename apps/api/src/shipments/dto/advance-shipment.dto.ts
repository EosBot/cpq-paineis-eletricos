import { IsIn, IsString } from 'class-validator';

const SHIPMENT_STATUSES = ['PENDING', 'LABEL_CREATED', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTION'] as const;

export class AdvanceShipmentDto {
  @IsString()
  shipmentId!: string;

  @IsIn(SHIPMENT_STATUSES)
  toStatus!: string;
}
