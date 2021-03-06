import { Injectable } from '@nestjs/common';
import { paginate } from 'src/common/utils/paginate.util';
import { CreateEventDTO } from 'src/event/dto/create-event.dto';
import { PTEventQuery } from 'src/event/query/event.query';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class EventService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getEvents(query: PTEventQuery) {
    const { page, limit, skip } = paginate(query.page, query.limit);

    return { page, limit, skip };
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
