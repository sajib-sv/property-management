import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { UserEntity } from '@project/common/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from '@project/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: string): Promise<TResponse<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        seller: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return successResponse(
      plainToInstance(UserEntity, user),
      'User profile fetched successfully',
    );
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    image?: Express.Multer.File,
  ): Promise<TResponse<UserEntity>> {
    let updatedImage = null;
    if (image) {
      const uploaded = await this.cloudinaryService.uploadImageFromBuffer(
        image.buffer,
        image.originalname,
      );

      updatedImage = uploaded.secure_url;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        // If image is provided, update it
        ...(updatedImage && { image: updatedImage }),
        language: dto.language,
        seller: {
          update: {
            phone: dto.phone,
            address: dto.address,
            city: dto.city,
            state: dto.state,
            country: dto.country,
            zip: dto.zip,
            companyName: dto.companyName,
            companyWebsite: dto.companyWebsite,
            subscriptionType: dto.subscriptionType,
            document: dto.document,
          },
        },
      },
    });

    return successResponse(
      plainToInstance(UserEntity, user),
      'User profile updated successfully',
    );
  }

  async getUserByAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { seller: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return successResponse(user, 'User fetched successfully');
  }

  async getSellers(query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.seller.findMany({
        skip,
        take: limit,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.seller.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getSellerById(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        user: true,
        property: true,
      },
    });

    if (!seller) throw new NotFoundException('Seller not found');

    return successResponse(seller, 'Seller fetched successfully');
  }

  async deleteSeller(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) throw new NotFoundException('Seller not found');

    await this.prisma.seller.delete({
      where: { id: sellerId },
    });

    return { message: `Seller ${sellerId} deleted successfully` };
  }

  async updateSellerStatus(
    sellerId: string,
    status: 'VERIFIED' | 'REJECTED' | 'PENDING',
  ) {
    const seller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        verificationStatus: status,
      },
    });

    return successResponse(seller, `Seller status updated to ${status}`);
  }
}
