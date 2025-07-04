import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PropertyCategory } from '@prisma/client';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(PropertyCategory)
  category: PropertyCategory;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }
    return value;
  })
  features: string[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  zip: string;
}
