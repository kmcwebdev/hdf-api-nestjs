import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AzureGraphApiController } from './azure-graph-api.controller';
import { AzureGraphApiService } from './azure-graph-api.service';

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
  controllers: [AzureGraphApiController],
  providers: [AzureGraphApiService],
  exports: [AzureGraphApiService],
})
export class AzureGraphApiModule {}
