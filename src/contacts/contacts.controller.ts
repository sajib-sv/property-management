import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard, RolesGuard } from '@project/common/jwt/jwt.guard';
import { UserEnum } from '@project/common/enum/user.enum';
import { Roles } from '@project/common/jwt/jwt.decorator';
import { IsReadDto } from './dto/is-read.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.contactsService.findAll({ page, limit });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  updateReadStatus(@Param('id') id: string, @Body() isReadDto: IsReadDto) {
    return this.contactsService.updateReadStatus(id, isReadDto);
  }
}
