import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class FilterConfigService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getUserAllowedSiteFilters(userId: number) {
    return await this.prismaClientService.userSiteFilter.findUnique({
      where: { userId },
      select: {
        sites: {
          select: {
            siteId: true,
            siteName: true,
          },
        },
      },
    });
  }
}
