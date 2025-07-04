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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/user')
  @ApiOperation({ summary: 'Register a regular user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterUserDto })
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  userRegister(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    const image = file ?? null;
    return this.authService.userRegister(registerUserDto, image);
  }

  @Post('register/seller')
  @ApiOperation({ summary: 'Register a seller' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterSellerDto })
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  sellerRegister(
    @UploadedFile() file: Express.Multer.File,
    @Body() registerSellerDto: RegisterSellerDto,
  ) {
    const image = file ?? null;
    return this.authService.sellerRegister(registerSellerDto, image);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP' })
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password (requires JWT)' })
  updatePassword(@Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(dto);
  }
}
