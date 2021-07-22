import {
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly azureStorage: AzureStorageService) {}

  async uploadFile(file: UploadedFileMetadata) {
    // If you don't want to override files.
    // file = {
    //   ...file,
    //   originalname: `${file.originalname}-${Date.now()}`,
    // };

    return await this.azureStorage.upload(file);
  }
}
