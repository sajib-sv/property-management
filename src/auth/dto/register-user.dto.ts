import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { AccountType } from '@prisma/client';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  language: string;

  @IsEnum(AccountType)
  accountType: AccountType;
}
