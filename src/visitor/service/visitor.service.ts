import { Injectable } from '@nestjs/common';
import { response } from 'src/common/serializer/response/response';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class VisitorService {
  constructor(private prismaClientService: PrismaClientService) {}

  async checkVisitorEmail(email: string) {
    const result = await this.prismaClientService.visitor.findUnique({
      where: { email },
    });

    return response<typeof result>(result);
  }
}
