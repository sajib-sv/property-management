import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AppError } from '@project/common/error/handle-errors.app';
import { PrismaService } from '@project/prisma/prisma.service';
import { CloudinaryService } from '@project/cloudinary/cloudinary.service';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { NewsEntity } from '../common/entity/news.entity';
import { plainToInstance } from 'class-transformer';
import { NewsCategory } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @HandleErrors('Error creating news')
  async create(
    createNewsDto: CreateNewsDto,
    image: Express.Multer.File,
  ): Promise<TResponse<NewsEntity>> {
    if (!image) {
      throw new AppError('Image file is required', 400);
    }

    const uploaded = await this.cloudinaryService.uploadImageFromBuffer(
      image.buffer,
      image.originalname,
    );

    const imageUrl = uploaded.secure_url;

    const data = {
      ...createNewsDto,
      thumbnail: imageUrl,
    };
    console.info(data);

    const news = await this.prisma.news.create({
      data,
    });

    return successResponse(
      plainToInstance(NewsEntity, news),
      'News created successfully',
    );
  }

  @HandleErrors('Error fetching news')
  async findAll(params: {
    category: NewsCategory;
    page: number;
    limit: number;
  }) {
    const { category, page, limit } = params;
    const skip = (page - 1) * limit;

    const news = await this.prisma.news.findMany({
      skip,
      take: limit,
      where: {
        category,
      },
    });

    return successResponse(
      plainToInstance(NewsEntity, news),
      'News fetched successfully',
    );
  }

  async findOneWithSuggestions(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });
    if (!news) {
      throw new AppError('News not found', 404);
    }

    const suggestedNews = await this.findByCategory(
      news.category as NewsCategory,
      {
        page: 1,
        limit: 3,
      },
    );

    return successResponse(
      {
        news,
        suggestedNews: suggestedNews.data,
      },
      'News fetched successfully',
    );
  }

  async findByCategory(
    category: NewsCategory,
    options: { page: number; limit: number },
  ) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const news = await this.prisma.news.findMany({
      where: { category },
      skip,
      take: limit,
    });

    return successResponse(
      plainToInstance(NewsEntity, news),
      'News by category fetched successfully',
    );
  }

  @HandleErrors('Error updating news')
  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    image?: Express.Multer.File,
  ): Promise<TResponse<NewsEntity>> {
    const existing = await this.prisma.news.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('News not found', 404);
    }

    let thumbnailUrl = existing.thumbnail;

    if (image) {
      const uploaded = await this.cloudinaryService.uploadImageFromBuffer(
        image.buffer,
        image.originalname,
      );
      thumbnailUrl = uploaded.secure_url;
    }

    const updated = await this.prisma.news.update({
      where: { id },
      data: {
        ...updateNewsDto,
        thumbnail: thumbnailUrl,
      },
    });

    return successResponse(
      plainToInstance(NewsEntity, updated),
      'News updated successfully',
    );
  }

  @HandleErrors('Error updating news status')
  async updateStatus(id: string, isPublished: boolean) {
    const existing = await this.prisma.news.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('News not found', 404);
    }

    const updated = await this.prisma.news.update({
      where: { id },
      data: { isPublished },
    });

    return successResponse(
      plainToInstance(NewsEntity, updated),
      'News status updated successfully',
    );
  }

  @HandleErrors('Error deleting news')
  async remove(id: string) {
    const existing = await this.prisma.news.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('News not found', 404);
    }

    await this.prisma.news.delete({ where: { id } });

    return successResponse(null, 'News deleted successfully');
  }

  @HandleErrors('Error fetching recent news')
  async getRecent() {
    const recent = await this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (!recent.length) {
      throw new AppError('No recent news found', 204);
    }

    return successResponse(
      plainToInstance(NewsEntity, recent),
      'Recent news fetched successfully',
    );
  }
}
