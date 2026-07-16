import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class AdvanceOrderDto {
  @IsString()
  orderId!: string;

  @IsEnum(OrderStatus)
  toStatus!: OrderStatus;
}
