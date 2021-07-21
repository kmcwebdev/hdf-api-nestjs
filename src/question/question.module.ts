import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
