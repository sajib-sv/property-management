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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard, RolesGuard } from '@project/common/jwt/jwt.guard';
import { GetUser, Roles } from '@project/common/jwt/jwt.decorator';
import { UserEnum } from '@project/common/enum/user.enum';
import { multerMemoryConfig } from '@project/common/utils/multer-config.util';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertyCategory } from '@prisma/client';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('seller')
  @UseInterceptors(FilesInterceptor('images', 10, multerMemoryConfig))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  createProperty(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPropertyDto: CreatePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.createProperty(
      createPropertyDto,
      userId,
      files,
    );
  }

  @Patch('seller/:id')
  @UseInterceptors(FilesInterceptor('images', 10, multerMemoryConfig))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  updateProperty(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.updateProperty(
      id,
      updatePropertyDto,
      userId,
      files,
    );
  }

  @Delete('seller/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  deleteProperty(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.propertiesService.deleteProperty(id, userId);
  }

  @Get('seller/:id/properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  getPropertiesBySeller(@Param('id') sellerId: string) {
    return this.propertiesService.findBySellerId(sellerId);
  }

  @Get('seller/:id/portfolio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  getSellerPortfolio(@GetUser('userId') userId: string) {
    return this.propertiesService.getSellerPortfolio(userId);
  }

  @Get('properties')
  getAllProperties(
    @Query('category') category?: PropertyCategory,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.propertiesService.findAll({
      category,
      search,
      minPrice,
      maxPrice,
      page,
      limit,
    });
  }

  @Get('trending')
  getTrendingProperties(
    @Query('category') category?: PropertyCategory,
    @Query('limit') limit?: number,
  ) {
    return this.propertiesService.getTrending(category, limit);
  }

  @Get(':id')
  getPropertyDetails(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Post('save/:id')
  @UseGuards(JwtAuthGuard)
  saveProperty(
    @GetUser('userId') userId: string,
    @Param('id') propertyId: string,
  ) {
    return this.propertiesService.saveProperty(propertyId, userId);
  }
}
