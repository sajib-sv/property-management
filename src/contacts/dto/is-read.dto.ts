import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class IsReadDto {
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isRead: boolean;
}
