import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/prisma/prisma.service';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { UserEntity } from '@project/common/entity/user.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

    return successResponse(
      plainToInstance(UserEntity, user),
      'User logged in successfully',
    );
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Placeholder: Update user profile
    return { message: `Updated profile for user ${userId}`, data: dto };
  }

  async getUserByAdmin(userId: string) {
    // Placeholder: Admin fetches user by ID
    return { message: `Admin fetched user ${userId}` };
  }

  async getSellers(query: any) {
    // Placeholder: Return paginated sellers
    return {
      data: [],
      total: 0,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }

  async getSellerById(sellerId: string) {
    // Placeholder: Fetch a seller by ID
    return { message: `Fetched seller ${sellerId}` };
  }

  async deleteSeller(sellerId: string) {
    // Placeholder: Delete a seller by ID
    return { message: `Deleted seller ${sellerId}` };
  }

  async updateSellerStatus(
    sellerId: string,
    isVerified: 'approved' | 'rejected' | 'pending',
  ) {
    // Placeholder: Update seller verification status
    return { message: `Seller ${sellerId} status updated to ${isVerified}` };
  }
}
