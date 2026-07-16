import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateComponentAttributeDto {
  @IsString()
  componentAttributeTemplateId!: string;

  @IsString()
  value!: string;
}

export class CreateComponentDto {
  @IsString()
  componentCategoryId!: string;

  @IsString()
  @MaxLength(120)
  sku!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComponentAttributeDto)
  attributes!: CreateComponentAttributeDto[];
}
