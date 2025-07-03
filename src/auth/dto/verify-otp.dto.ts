import { IsEmail, IsInt } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsInt()
  otpCode: number;
}
