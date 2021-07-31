import { UploadedFileMetadata } from '@nestjs/azure-storage';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { S3DeleteFileDTO } from 'src/file/dto/delete-file.dto';
import { FileUploadDTO } from './dto/file-upload.dto';
import { S3PresignedFileUrlDTO } from './dto/pre-signed-file-url.dto';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('azure-blob/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Success' })
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileInAzure(
    @UploadedFile()
    file: UploadedFileMetadata,
  ) {
    await this.fileService.uploadFileInAzure({ file });

    return {
      fileUrl: `https://cdn.kmc.solutions/events/${file.originalname}`,
    };
  }

  @Post('aws-s3/upload')
  @ApiQuery({ type: FileUploadDTO })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 10000000 },
    }),
  )
  uploadFile(
    @Req() req: Request,
    @Query() query: FileUploadDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { description } = query;

    return this.fileService.uploadFile(file, {
      userId: query.userId || user.id,
      description,
      security: query.security,
    });
  }

  @Get('aws-s3/presigned')
  @ApiQuery({ type: S3PresignedFileUrlDTO })
  @ApiOkResponse({ description: 'Success' })
  generatePresignedFile(@Query() query: S3PresignedFileUrlDTO) {
    return this.fileService.generatePresignedFile(query);
  }

  @Delete('aws-s3/:fileKey')
  @ApiParam({ name: 'fileKey', type: String })
  deleteFile(@Param() { fileKey }: S3DeleteFileDTO) {
    return this.fileService.deleteFile(fileKey);
  }
}
