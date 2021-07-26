import { UploadedFileMetadata } from '@nestjs/azure-storage';
import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('azure/upload')
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
}
