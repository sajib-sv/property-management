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

  async findAll(params: { category?: string; page: number; limit: number }) {
    // Implement logic to fetch all news with pagination and optional category
    return [{ id: 1, title: 'Sample News', ...params }];
  }

  async findOneWithSuggestions(id: string) {
    // Implement logic to fetch a single news article and suggestions
    return { id, title: 'Sample News', suggestions: [] };
  }

  async findByCategory(
    category: string,
    options: { page: number; limit: number },
  ) {
    // Implement logic to fetch news by category with pagination
    return [{ id: 2, title: 'Category News', category, ...options }];
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
