import { NewsCategory } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsString()
  category: NewsCategory;

  @IsOptional() // * Marks it as "allowed" to be omitted
  content: any; // * Use 'any' to allow any JSON structure
}
