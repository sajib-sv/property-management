import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@project/common/utils/multer-config.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/user')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  userRegister(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    const image = file ?? null;

    return this.authService.userRegister(registerUserDto, image);
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

  // * This is just for testing file upload functionality
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    return this.authService.updateProfileImage(file.filename);
  }
}
