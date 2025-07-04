import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard, RolesGuard } from '@project/common/jwt/jwt.guard';
import { IsPublishedDto } from './dto/is-published.dto';
import { Roles } from '@project/common/jwt/jwt.decorator';
import { UserEnum } from '@project/common/enum/user.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryConfig } from '@project/common/utils/multer-config.util';
import { NewsCategory } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a news article (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateNewsDto })
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    const image = file ?? null;
    return this.newsService.create(createNewsDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news by category (paginated)' })
  @ApiQuery({ name: 'category', enum: NewsCategory, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('category') category: NewsCategory = NewsCategory.GENERAL,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.newsService.findAll({ category, page, limit });
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent news' })
  async getRecent() {
    return this.newsService.getRecent();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news details with suggested news' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.newsService.findOneWithSuggestions(id);
  }

  @Get('category/:category')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get news by category (paginated)' })
  @ApiParam({ name: 'category', enum: NewsCategory })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByCategory(
    @Param('category') category: NewsCategory,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.newsService.findByCategory(category, {
      page,
      limit,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a news article (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateNewsDto })
  @ApiParam({ name: 'id', type: String })
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    const image = file ?? null;
    return this.newsService.update(id, updateNewsDto, image);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update publication status (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: IsPublishedDto })
  updateStatus(@Param('id') id: string, @Body() body: IsPublishedDto) {
    return this.newsService.updateStatus(id, body.isPublished);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a news article (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
