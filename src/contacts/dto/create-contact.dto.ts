import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  message: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsString()
  phone: number;

  @IsString()
  country: string;
}
