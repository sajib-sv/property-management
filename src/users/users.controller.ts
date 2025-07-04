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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard, RolesGuard } from '@project/common/jwt/jwt.guard';
import { GetUser, Roles } from '@project/common/jwt/jwt.decorator';
import { UserEnum } from '@project/common/enum/user.enum';
import { multerMemoryConfig } from '@project/common/utils/multer-config.util';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @Get('profile')
  getProfile(@GetUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDto })
  @Put('profile')
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  updateProfile(
    @GetUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    const image = file ?? null;
    return this.usersService.updateProfile(userId, dto, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @Get('admin/user/:id')
  getUserByAdmin(@Param('id') id: string) {
    return this.usersService.getUserByAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated list of sellers (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('admin/sellers')
  getSellers(@Query() query: { page?: number; limit?: number }) {
    return this.usersService.getSellers(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller details by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @Get('admin/seller/:id')
  getSellerById(@Param('id') id: string) {
    return this.usersService.getSellerById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a seller by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @Delete('seller/:id')
  deleteSeller(@Param('id') id: string) {
    return this.usersService.deleteSeller(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seller verification status (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isVerified: {
          type: 'string',
          enum: ['VERIFIED', 'REJECTED', 'PENDING'],
        },
      },
    },
  })
  @Patch('seller/status/:id')
  @HttpCode(200)
  updateSellerStatus(
    @Param('id') id: string,
    @Body('isVerified') isVerified: 'VERIFIED' | 'REJECTED' | 'PENDING',
  ) {
    return this.usersService.updateSellerStatus(id, isVerified);
  }
}
