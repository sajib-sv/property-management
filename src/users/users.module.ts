import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@project/prisma/prisma.module';
import { CloudinaryModule } from '@project/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
