import { UploadedFiles } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

export enum PropertyCategory {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  LAND = 'LAND',
  OTHER = 'OTHER',
}

export class CreatePropertyDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', enum: Object.values(PropertyCategory) })
  @IsString()
  category: PropertyCategory;

  @ApiProperty({ type: 'string' })
  @IsString()
  description: string;

  @ApiProperty({ type: 'number' })
  @IsInt()
  @Type(() => Number)
  price: number;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
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

  @ApiProperty({ type: 'string' })
  @IsString()
  address: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  country: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  state: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  city: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  zip: string;

  // @ApiProperty({
  //   description: 'Image Datas',
  //   format: 'binary',
  //   type: 'array',
  //   items: {
  //     type: 'string',
  //     format: 'file',
  //   },
  // })
  // images: Express.Multer.File[];
}
