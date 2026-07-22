import {
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { StockMovementType } from '@prisma/client';

export class CreateStockMovementDto {
  @IsString()
  productId!: string;

  @IsString()
  locationId!: string;

  @IsEnum(StockMovementType)
  type!: StockMovementType;

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
