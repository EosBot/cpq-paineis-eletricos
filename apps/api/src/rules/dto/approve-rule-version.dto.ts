import { IsOptional, IsString } from 'class-validator';

export class ApproveRuleVersionDto {
  @IsString()
  ruleVersionId!: string;

  @IsOptional()
  @IsString()
  approvedByUserId?: string;
}
