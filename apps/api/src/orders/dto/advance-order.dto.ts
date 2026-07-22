import { IsIn, IsString } from 'class-validator';

const ORDER_STATUSES = ['CONFIRMED', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'] as const;

export class AdvanceOrderDto {
  @IsString()
  orderId!: string;

  @IsIn(ORDER_STATUSES)
  toStatus!: string;
}
