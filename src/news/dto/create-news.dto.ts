import { IsString, IsBoolean, IsDateString, IsJSON } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsString()
  location: string;

  @IsJSON()
  content: JSON;

  @IsDateString()
  firstPublishedAt: string;

  @IsBoolean()
  isPublished: boolean;
}
