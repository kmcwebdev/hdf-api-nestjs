import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AzureGraphController } from './azure-graph.controller';
import { AzureGraphService } from './azure-graph.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        config: ConfigService<{ erp: { baseUrl: string; apiKey: string } }>,
      ) => ({
        baseURL: config.get<string>('erp.baseUrl', { infer: true }),
        params: {
          apiKey: config.get<string>('erp.apiKey', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AzureGraphController],
  providers: [AzureGraphService],
  exports: [AzureGraphService],
})
export class AzureGraphModule {}
