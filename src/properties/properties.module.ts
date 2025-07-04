import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PrismaService } from '@project/prisma/prisma.service';
import { CloudinaryService } from '@project/cloudinary/cloudinary.service';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, PrismaService, CloudinaryService],
})
export class PropertiesModule {}
