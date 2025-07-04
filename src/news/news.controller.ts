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

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @UseInterceptors(FileInterceptor('image', multerMemoryConfig))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    const image = file ?? null;

    return this.newsService.create(createNewsDto, image);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.newsService.findAll({ category, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOneWithSuggestions(id);
  }

  @Get('category/:category')
  @HttpCode(200)
  findByCategory(
    @Param('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.newsService.findByCategory(category, {
      page,
      limit,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  updateStatus(@Param('id') id: string, @Body() body: IsPublishedDto) {
    return this.newsService.updateStatus(id, body.isPublished);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Get('recent')
  @HttpCode(200)
  async getRecent() {
    const recent = await this.newsService.getRecent();
    if (!recent.length)
      return { statusCode: 204, message: 'No recent news found' };
    return { statusCode: 200, data: recent };
  }
}
