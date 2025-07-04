import { PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
  @IsOptional()
  @IsDateString()
  firstPublishedAt: string;

  @IsBoolean()
  isPublished: boolean;
}
