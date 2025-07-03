import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard, RolesGuard } from '@project/common/jwt/jwt.guard';
import { GetUser, Roles } from '@project/common/jwt/jwt.decorator';
import { UserEnum } from '@project/common/enum/user.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  // PUT /profile
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(
    @GetUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  // GET /admin/user/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @Get('admin/user/:id')
  getUserByAdmin(@Param('id') id: string) {
    return this.usersService.getUserByAdmin(id);
  }

  // GET /admin/sellers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @Get('admin/sellers')
  getSellers(@Query() query: { page?: number; limit?: number }) {
    return this.usersService.getSellers(query);
  }

  // GET /admin/seller/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @Get('admin/seller/:id')
  getSellerById(@Param('id') id: string) {
    return this.usersService.getSellerById(id);
  }

  // DELETE /admin/seller/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @Delete('admin/seller/:id')
  deleteSeller(@Param('id') id: string) {
    return this.usersService.deleteSeller(id);
  }

  // PATCH /admin/seller/:id/status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @Patch('admin/seller/:id/status')
  @HttpCode(200)
  updateSellerStatus(
    @Param('id') id: string,
    @Body('isVerified') isVerified: 'VERIFIED' | 'REJECTED' | 'PENDING',
  ) {
    return this.usersService.updateSellerStatus(id, isVerified);
  }
}
