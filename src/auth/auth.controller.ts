import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryConfig } from '@project/common/utils/multer-config.util';
import { JwtAuthGuard } from '@project/common/jwt/jwt.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/user')
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  userRegister(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    const image = file ?? null;

    return this.authService.userRegister(registerUserDto, image);
  }

  // * first create a user, then create a seller under that user
  @Post('register/seller')
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  sellerRegister(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerSellerDto: RegisterSellerDto,
  ) {
    const image = file ?? null;

    return this.authService.sellerRegister(registerSellerDto, image);
  }

  @Post('verify')
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  updatePassword(@Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(dto);
  }
}
