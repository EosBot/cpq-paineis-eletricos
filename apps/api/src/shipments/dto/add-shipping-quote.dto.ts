import { IsInt, IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddShippingQuoteDto {
  @IsString()
  shipmentId!: string;

  @IsString()
  @MaxLength(120)
  provider!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  serviceName?: string;

  @IsNumber()
  amount!: number;

  @IsString()
  @MaxLength(3)
  currencyCode!: string;

  @IsOptional()
  @IsInt()
  estimatedDays?: number;

  @IsOptional()
  @IsObject()
  rawQuote?: Record<string, unknown>;
}
