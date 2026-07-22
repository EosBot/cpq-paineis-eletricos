import {
  IsDecimal,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const STOCK_MOVEMENT_TYPES = ['ENTRADA', 'SAIDA', 'AJUSTE', 'TRANSFERENCIA'] as const;

export class CreateStockMovementDto {
  @IsString()
  productId!: string;

  @IsString()
  locationId!: string;

  @IsIn(STOCK_MOVEMENT_TYPES)
  type!: string;

  @IsDecimal({ decimal_digits: '0,4' })
  quantity!: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,4' })
  unitCost?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  referenceType?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
