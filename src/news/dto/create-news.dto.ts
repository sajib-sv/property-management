import { IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsString()
  category: string;

  @IsOptional() // * Marks it as "allowed" to be omitted
  content: any; // * Use 'any' to allow any JSON structure
}
