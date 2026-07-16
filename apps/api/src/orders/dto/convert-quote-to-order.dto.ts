import { IsString, MaxLength } from 'class-validator';

export class ConvertQuoteToOrderDto {
  @IsString()
  quoteId!: string;

  @IsString()
  @MaxLength(120)
  orderNumber!: string;
}
