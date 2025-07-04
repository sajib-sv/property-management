import { IsBoolean } from 'class-validator';

export class IsPublishedDto {
  @IsBoolean()
  isPublished: boolean;
}
