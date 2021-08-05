import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { MiscController } from './misc.controller';
import { MiscService } from './misc.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [MiscController],
  providers: [MiscService],
})
export class MiscModule {}
