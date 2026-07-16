import { IsString } from 'class-validator';

export class CustomerApproveQuoteDto {
  @IsString()
  quoteId!: string;
}
