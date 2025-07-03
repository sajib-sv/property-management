import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/user')
  userRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.userRegister(registerUserDto);
  }

  // * first create a user, then create a seller under that user
  @Post('register/seller')
  sellerRegister(@Body() registerSellerDto: RegisterSellerDto) {
    return this.authService.sellerRegister(registerSellerDto);
  }

  @Post('verify')
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }
}
