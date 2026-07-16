import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateConfigurationItemDto {
  @IsString()
  componentId!: string;

  @IsString()
  quantity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  positionKey?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateConfigurationDto {
  @IsString()
  quoteId!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsObject()
  graphData?: Record<string, unknown>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConfigurationItemDto)
  items!: CreateConfigurationItemDto[];
}
