import { IsOptional, IsString } from 'class-validator';

export class SendQuoteDto {
  @IsString()
  quoteId!: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;
}
