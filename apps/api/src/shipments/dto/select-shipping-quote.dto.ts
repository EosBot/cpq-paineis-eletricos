import { IsString } from 'class-validator';

export class SelectShippingQuoteDto {
  @IsString()
  shippingQuoteId!: string;
}
