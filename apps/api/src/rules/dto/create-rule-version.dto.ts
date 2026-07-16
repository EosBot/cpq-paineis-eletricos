import { IsObject, IsString } from 'class-validator';

export class CreateRuleVersionDto {
  @IsString()
  ruleId!: string;

  @IsObject()
  definition!: Record<string, unknown>;
}
