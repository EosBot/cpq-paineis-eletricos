import { IsString, MaxLength } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(120)
  code!: string;
}
