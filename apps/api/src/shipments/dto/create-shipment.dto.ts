import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  orderId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  recipientName?: string;

  @IsOptional()
  @IsObject()
  shippingAddress?: Record<string, unknown>;
}
