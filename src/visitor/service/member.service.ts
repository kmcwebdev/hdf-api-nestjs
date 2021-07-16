import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class MemberService {
  constructor(private prismaClientService: PrismaClientService) {}
}
