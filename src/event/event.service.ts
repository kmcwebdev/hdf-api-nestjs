import { Injectable } from '@nestjs/common';
import { CreateEventDTO } from 'src/common/dto/event/create-event.dto';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class EventService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getEvents() {
    return true;
  }

  async getEvent(id: number) {
    return await this.prismaClientService.event.findUnique({ where: { id } });
  }

  async createEvent(data: CreateEventDTO) {
    return await this.prismaClientService.event.create({
      data,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        dateFrom: true,
        dateTo: true,
        time: true,
        site: {
          select: {
            siteName: true,
          },
        },
        floor: {
          select: {
            floor: true,
          },
        },
        contactPerson: true,
        contactEmail: true,
      },
    });
  }
}
