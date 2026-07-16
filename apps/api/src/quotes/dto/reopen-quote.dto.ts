import { IsString, MaxLength } from 'class-validator';

export class ReopenQuoteDto {
  @IsString()
  quoteId!: string;

  @IsString()
  @MaxLength(500)
  reason!: string;
}
