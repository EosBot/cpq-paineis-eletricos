import { IsString } from 'class-validator';

export class SubmitConfigurationForReviewDto {
  @IsString()
  configurationId!: string;
}
