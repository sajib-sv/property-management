import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SavePropertyDto } from './dto/save-property.dto';
import { PrismaService } from '@project/prisma/prisma.service';
import { CloudinaryService } from '@project/cloudinary/cloudinary.service';
import { successResponse } from '@project/common/utils/response.util';
import { AppError } from '@project/common/error/handle-errors.app';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    userId: string,
    files: Express.Multer.File[] = [],
  ) {
    let images: string[] = [];
    if (files && files.length > 0) {
      images = await Promise.all(
        files.map(async (file) => {
          const uploaded = await this.cloudinaryService.uploadImageFromBuffer(
            file.buffer,
            file.originalname,
            'properties',
          );
          return uploaded.secure_url;
        }),
      );
    }

    const seller = await this.prisma.seller.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!seller) {
      throw new AppError('Seller not found', 404);
    }

    const result = await this.prisma.property.create({
      data: {
        ...createPropertyDto,
        images,
        sellerId: seller.id,
      },
    });

    return successResponse(result, 'Property created successfully');
  }

  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
  ) {
    // Simulate property update
    return { id, ...updatePropertyDto, sellerId: userId };
  }

  async deleteProperty(id: string, userId: string) {
    // Simulate property deletion
    return { id, deleted: true, sellerId: userId };
  }

  async findBySellerId(sellerId: string) {
    // Simulate fetching properties by seller
    return [{ id: 1, sellerId, title: 'Sample Property' }];
  }

  async getSellerPortfolio(userId: string) {
    // Simulate fetching seller portfolio
    return { userId, portfolio: [{ id: 1, title: 'Portfolio Property' }] };
  }

  async findAll(params: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    // Simulate fetching all properties with filters
    return [{ id: 1, ...params, title: 'Filtered Property' }];
  }

  async getTrending(category?: string, limit?: number) {
    // Simulate fetching trending properties
    return [{ id: 2, title: 'Trending Property', category }].slice(0, limit);
  }

  async findOne(id: string) {
    // Simulate fetching property details
    return { id, title: 'Property Details' };
  }

  async saveProperty(body: SavePropertyDto, userId: string) {
    // Simulate saving a property for a user
    return { ...body, userId, saved: true };
  }
}
