import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('register/user')
  userRegister() {
    return this.authService.userRegister();
  }

  @Post('register/seller')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.sellerRegister(createAuthDto);
  }

  @Post('verify')
  verify(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.verify(createAuthDto);
  }
}
