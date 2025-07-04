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
  HttpStatus,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '@project/common/jwt/jwt.guard';
import { IsPublishedDto } from './dto/is-published.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createNewsDto: CreateNewsDto) {
    const news = await this.newsService.create(createNewsDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'News article created',
      data: news,
    };
  }

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const news = await this.newsService.findAll({ category, page, limit });
    return { statusCode: 200, data: news };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findOneWithSuggestions(id);
    return { statusCode: 200, data: news };
  }

  @Get('category/:category')
  @HttpCode(200)
  async findByCategory(
    @Param('category') category: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const news = await this.newsService.findByCategory(category, {
      page,
      limit,
    });
    return { statusCode: 200, data: news };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const updated = await this.newsService.update(id, updateNewsDto);
    return { statusCode: 200, message: 'News updated', data: updated };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: IsPublishedDto) {
    const updated = await this.newsService.updateStatus(id, body.isPublished);
    return { statusCode: 200, message: 'Status updated', data: updated };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.newsService.remove(id);
    return { statusCode: 200, message: 'News deleted' };
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
