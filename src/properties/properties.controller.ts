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
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SavePropertyDto } from './dto/save-property.dto';
import { JwtAuthGuard, RolesGuard } from '@project/common/jwt/jwt.guard';
import { GetUser, Roles } from '@project/common/jwt/jwt.decorator';
import { UserEnum } from '@project/common/enum/user.enum';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.createProperty(createPropertyDto, userId);
  }

  @Patch('seller/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Seller)
  updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto, userId);
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
    @Query('category') category?: string,
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

  @Get('properties/trending')
  getTrendingProperties(
    @Query('category') category?: string,
    @Query('limit') limit?: number,
  ) {
    return this.propertiesService.getTrending(category, limit);
  }

  @Get('property/:id')
  getPropertyDetails(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Post('property/save')
  @UseGuards(JwtAuthGuard)
  saveProperty(
    @Body() body: SavePropertyDto,
    @GetUser('userId') userId: string,
  ) {
    return this.propertiesService.saveProperty(body, userId);
  }
}
