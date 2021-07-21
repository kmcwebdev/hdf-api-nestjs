import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class QuestionService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getQuestions() {
    return await this.prismaClientService.question.findMany({
      include: { answers: true },
      orderBy: { questionOrder: 'asc' },
    });
  }
}
