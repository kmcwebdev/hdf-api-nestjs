import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
