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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('seller')
  @UseInterceptors(FilesInterceptor('images', 10, multerMemoryConfig))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create property (Seller only)' })
  @ApiBody({ type: CreatePropertyDto })
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
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update property (Seller only)' })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiParam({ name: 'id', required: true })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete property (Seller only)' })
  @ApiParam({ name: 'id' })
  deleteProperty(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.propertiesService.deleteProperty(id, userId);
  }

  @Get('seller/:id/properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all properties by seller ID (Seller only)' })
  @ApiParam({ name: 'id' })
  getPropertiesBySeller(@Param('id') sellerId: string) {
    return this.propertiesService.findBySellerId(sellerId);
  }

  @Get('seller/:id/portfolio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller portfolio (Seller only)' })
  getSellerPortfolio(@GetUser('userId') userId: string) {
    return this.propertiesService.getSellerPortfolio(userId);
  }

  @Get('properties')
  @ApiOperation({ summary: 'Get all properties (public)' })
  @ApiQuery({ name: 'category', enum: PropertyCategory, required: false })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
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
  @ApiOperation({ summary: 'Get trending properties (public)' })
  @ApiQuery({ name: 'category', enum: PropertyCategory, required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTrendingProperties(
    @Query('category') category?: PropertyCategory,
    @Query('limit') limit?: number,
  ) {
    return this.propertiesService.getTrending(category, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details (public)' })
  @ApiParam({ name: 'id', type: String })
  getPropertyDetails(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Post('save/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save property for user (authenticated)' })
  @ApiParam({ name: 'id', type: String })
  saveProperty(
    @GetUser('userId') userId: string,
    @Param('id') propertyId: string,
  ) {
    return this.propertiesService.saveProperty(propertyId, userId);
  }
}
