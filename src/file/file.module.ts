import { AzureStorageModule } from '@nestjs/azure-storage';
import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

dotenv.config();

@Module({
  imports: [
    PrismaClientModule,
    AzureStorageModule.withConfig({
      sasKey: process.env.AZURE_STORAGE_SAS_KEY,
      accountName: process.env.AZURE_STORAGE_ACCOUNT,
      containerName: 'events',
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
