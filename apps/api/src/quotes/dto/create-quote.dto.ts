import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  customerAccountId!: string;

  @IsOptional()
  @IsString()
  primaryContactId?: string;

  @IsOptional()
  @IsString()
  commercialContractId?: string;

  @IsString()
  @MaxLength(120)
  quoteNumber!: string;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  currencyCode!: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;
}
