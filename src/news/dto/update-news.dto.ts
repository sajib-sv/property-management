import { PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
  @IsOptional()
  @IsDateString()
  firstPublishedAt: string;
}
