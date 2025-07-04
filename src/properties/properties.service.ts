import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from '@project/prisma/prisma.service';
import { CloudinaryService } from '@project/cloudinary/cloudinary.service';
import { successResponse } from '@project/common/utils/response.util';
import { AppError } from '@project/common/error/handle-errors.app';
import { PropertyCategory } from '@prisma/client';
import { subDays } from 'date-fns';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  @HandleErrors()
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

  @HandleErrors()
  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
    files: Express.Multer.File[] = [],
  ) {
    // Find property
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    // Check seller
    const seller = await this.prisma.seller.findUnique({ where: { userId } });
    if (!seller) {
      throw new AppError('Seller not found', 404);
    }
    if (property.sellerId !== seller.id) {
      throw new AppError('Unauthorized', 403);
    }

    let images = property.images || [];
    if (files && files.length > 0) {
      // Upload new images and merge with existing
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploaded = await this.cloudinaryService.uploadImageFromBuffer(
            file.buffer,
            file.originalname,
            'properties',
          );
          return uploaded.secure_url;
        }),
      );
      images = [...images, ...uploadedImages];
    }

    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        ...updatePropertyDto,
        images,
      },
    });

    return successResponse(updated, 'Property updated successfully');
  }

  @HandleErrors('Property not found', 'property')
  async deleteProperty(id: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      throw new AppError('Seller not found', 404);
    }
    if (property.sellerId !== seller.id) {
      throw new AppError('Unauthorized', 403);
    }

    const result = await this.prisma.property.delete({
      where: { id },
    });

    return successResponse(result, 'Property deleted successfully');
  }

  @HandleErrors()
  async findBySellerId(sellerId: string) {
    const properties = await this.prisma.property.findMany({
      where: { sellerId },
    });

    return successResponse(properties, 'Properties fetched successfully');
  }

  @HandleErrors()
  async getSellerPortfolio(userId: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        seller: {
          include: {
            property: true,
          },
        },
      },
    });

    return successResponse(
      {
        profile,
        properties: profile?.seller ? profile.seller.property : [],
      },
      'Seller portfolio fetched successfully',
    );
  }

  async findAll(params: {
    category?: PropertyCategory;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = params;

    const skip = (page - 1) * limit;

    const properties = await this.prisma.property.findMany({
      skip,
      take: limit,
      where: {
        category,
        title: {
          contains: search,
        },
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    });

    return successResponse(properties, 'Properties fetched successfully');
  }

  @HandleErrors()
  async getTrending(category?: PropertyCategory, limit?: number) {
    const properties = await this.prisma.property.findMany({
      where: {
        ...(category && { category }),
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      orderBy: {
        views: 'desc',
      },
      take: limit ?? 10, // default limit if not provided
    });

    return successResponse(properties, 'Properties fetched successfully');
  }

  @HandleErrors()
  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    return successResponse(property, 'Property fetched successfully');
  }

  @HandleErrors()
  async saveProperty(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const savedProperty = await this.prisma.propertySaved.create({
      data: {
        propertyId: property.id,
        userId: user.id,
      },
    });

    return successResponse(savedProperty, 'Property saved successfully');
  }
}
