import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { IsReadDto } from './dto/is-read.dto';
import { PrismaService } from '@project/prisma/prisma.service';
import { successResponse } from '@project/common/utils/response.util';
import { AppError } from '@project/common/error/handle-errors.app';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleErrors('Contact not created', 'contact')
  async create(createContactDto: CreateContactDto) {
    const contactData = await this.prisma.contact.create({
      data: createContactDto,
    });
    return successResponse(contactData, 'Contact created successfully');
  }

  @HandleErrors('Contacts not found', 'contacts')
  async findAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const skip = (page - 1) * limit;
    const contacts = await this.prisma.contact.findMany({
      skip,
      take: limit,
    });
    return successResponse(contacts, 'Contacts fetched successfully');
  }

  @HandleErrors('Contact not found', 'contact')
  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    return successResponse(contact, 'Contact retrieved successfully');
  }

  @HandleErrors('Contact not found', 'contact')
  async updateReadStatus(id: string, isReadDto: IsReadDto) {
    const contact = await this.prisma.contact.update({
      where: { id },
      data: {
        isRead: isReadDto.isRead,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    return successResponse(contact, 'Contact updated successfully');
  }
}
