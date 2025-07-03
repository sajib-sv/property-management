import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { SubscriptionType } from '@prisma/client';
import { RegisterUserDto } from './register-user.dto';
import { Type } from 'class-transformer';

export class RegisterSellerDto extends RegisterUserDto {
  @IsString()
  companyName: string;

  @IsOptional()
  @IsEnum(SubscriptionType)
  subscriptionType?: SubscriptionType;

  @IsString()
  companyWebsite: string;

  @Type(() => Number)
  @IsInt()
  phone: number;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  zip: string;

  @IsString()
  document: string;
}
