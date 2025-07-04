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
import { NewsEntity } from './entities/news.entity';
import { plainToInstance } from 'class-transformer';

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
  async findAll(params: { category?: string; page: number; limit: number }) {
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

    const suggestedNews = await this.findByCategory(news.category, {
      page: 1,
      limit: 3,
    });

    return successResponse(
      {
        news,
        suggestedNews: suggestedNews.data,
      },
      'News fetched successfully',
    );
  }

  async findByCategory(
    category: string,
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

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    // Implement logic to update a news article
    return { id, ...updateNewsDto };
  }

  async updateStatus(id: string, isPublished: boolean) {
    // Implement logic to update the published status of a news article
    return { id, isPublished };
  }

  async remove(id: string) {
    // Implement logic to remove a news article
    return { id, deleted: true };
  }

  async getRecent() {
    // Implement logic to fetch recent news articles
    return [
      { id: 3, title: 'Recent News 1' },
      { id: 4, title: 'Recent News 2' },
    ];
  }
}
