import {
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 as awsS3 } from 'aws-sdk';
import * as mime from 'mime-types';
import { InjectS3, S3 } from 'nestjs-s3';
import * as path from 'path';
import slugify from 'slugify';
import { FileACL } from 'src/file/enum/file-acl.enum';
import tinify from 'tinify';
import { FileUploadDTO } from './dto/file-upload.dto';
import { S3PresignedFileUrlDTO } from './dto/pre-signed-file-url.dto';
import { FileOperation } from './enum/file-operation.enum';

@Injectable()
export class FileService {
  private tinifyApiKey: string;
  private bucket: string;

  constructor(
    private readonly azureStorage: AzureStorageService,
    readonly config: ConfigService,
    @InjectS3() private s3: S3,
  ) {
    this.tinifyApiKey = this.config.get<string>('tinify.apiKey');
    this.bucket = this.config.get<string>('s3.bucket');
  }

  getMimetypeAndFileExtension(file: Express.Multer.File) {
    const mimeType = mime.lookup(file.originalname).toString();
    const ext = path.extname(file.originalname);

    return { mimeType, ext };
  }

  async compressedImage(file: Express.Multer.File, isImage: boolean) {
    let fBuffer: Buffer | Uint8Array;

    tinify.key = this.tinifyApiKey;

    await tinify.validate().catch((error) => error);

    const compressionsThisMonth = tinify.compressionCount;

    if (isImage && compressionsThisMonth < 500) {
      const source = tinify.fromBuffer(file.buffer);

      fBuffer = await source.toBuffer();
    } else {
      fBuffer = file.buffer;
    }

    return fBuffer;
  }

  isImage(mimeType: string) {
    return (
      mimeType === 'image/jpeg' ||
      mimeType === 'image/png' ||
      mimeType === 'image/gif'
    );
  }

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

  async uploadFile(file: Express.Multer.File, options: FileUploadDTO) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    const { mimeType, ext } = this.getMimetypeAndFileExtension(file);

    const fileKey = `${slugify(
      file.originalname.split('.')[0],
      '-',
    )}${Date.now()}${ext}`.toLowerCase();

    const fileSecurity = options.security || FileACL.private;

    const fBuffer = await this.compressedImage(file, this.isImage(mimeType));

    const params: awsS3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: fileKey,
      Body: fBuffer,
      ACL: fileSecurity,
      ContentType: mimeType,
    };

    const S3UploadFile = await this.s3.putObject(params).promise();

    if (S3UploadFile.$response.error) {
      throw new UnprocessableEntityException(S3UploadFile.$response.error);
    }

    const uploadedFileKey =
      S3UploadFile.$response['request']['params']['Key'] || fileKey;

    return uploadedFileKey;
  }

  async generatePresignedFile(options: S3PresignedFileUrlDTO) {
    const { fileKey } = options;

    if (!options.expires) options.expires = 60 * 10;

    if (!options.operation) options.operation = FileOperation.getObject;

    const preSignedUrl = await this.s3
      .getSignedUrlPromise(options.operation, {
        Bucket: this.bucket,
        Key: fileKey,
        Expires: options.expires,
      })
      .catch((e) => {
        throw new BadRequestException(e);
      });

    return {
      url: preSignedUrl,
    };
  }

  async deleteFile(fileKey: string) {
    const s3Params = {
      Bucket: this.bucket,
      Key: fileKey,
    };

    const deleteFile = await this.s3.deleteObject(s3Params).promise();

    if (deleteFile.$response.error) {
      throw new UnprocessableEntityException(deleteFile.$response.error);
    }

    return deleteFile;
  }
}
