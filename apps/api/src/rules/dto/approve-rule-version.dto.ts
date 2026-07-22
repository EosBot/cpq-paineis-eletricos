import { IsString } from 'class-validator';

export class ApproveRuleVersionDto {
  @IsString()
  ruleVersionId!: string;
}
