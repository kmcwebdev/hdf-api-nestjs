import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { FilterConfigController } from './filter-config.controller';
import { FilterConfigService } from './filter-config.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [FilterConfigController],
  providers: [FilterConfigService],
})
export class FilterConfigModule {}
