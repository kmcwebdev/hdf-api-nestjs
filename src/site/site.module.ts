import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [
    PrismaClientModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<{ erp: { baseUrl: string } }>,
      ) => ({
        baseURL: configService.get<string>('erp.baseUrl', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
