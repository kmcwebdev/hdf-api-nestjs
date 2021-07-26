import {
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly azureStorage: AzureStorageService) {}

  /**
   * @param data
   * @returns fileUrl
   */
  async uploadFileInAzure(data: {
    file: UploadedFileMetadata;
    override?: true;
  }) {
    let { file } = data;
    const { override } = data;

    file = {
      ...file,
      originalname: override
        ? file.originalname
        : `${file.originalname}-${Date.now()}`,
    };

    return await this.azureStorage.upload(file);
  }
}
