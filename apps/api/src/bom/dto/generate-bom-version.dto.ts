import { IsString } from 'class-validator';

export class GenerateBomVersionDto {
  @IsString()
  quoteId!: string;

  @IsString()
  quoteVersionId!: string;

  @IsString()
  configurationSnapshotId!: string;
}
