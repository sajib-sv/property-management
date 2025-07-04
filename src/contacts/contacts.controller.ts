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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact message (public)' })
  @ApiBody({ type: CreateContactDto })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contact messages (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.contactsService.findAll({ page, limit });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single contact message by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.Admin, UserEnum.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update read status of a contact message (admin only)',
  })
  @ApiBody({ type: IsReadDto })
  updateReadStatus(@Param('id') id: string, @Body() isReadDto: IsReadDto) {
    return this.contactsService.updateReadStatus(id, isReadDto);
  }
}
