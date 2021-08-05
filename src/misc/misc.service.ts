import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class MiscService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getLeaveTypes() {
    return await this.prismaClientService.leaveType.findMany();
  }
}
