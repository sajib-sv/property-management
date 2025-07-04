import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class IsPublishedDto {
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublished: boolean;
}
