import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaService } from '@project/prisma/prisma.service';
import { CloudinaryService } from '@project/cloudinary/cloudinary.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, PrismaService, CloudinaryService],
})
export class NewsModule {}
