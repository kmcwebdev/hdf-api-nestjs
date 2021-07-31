import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileOperation } from '../enum/file-operation.enum';

export class S3PresignedFileUrlDTO {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly fileKey: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(FileOperation, {
    message: "Operation accepted values ['getObject', 'putObject']",
  })
  operation?: FileOperation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  expires?: number;
}
