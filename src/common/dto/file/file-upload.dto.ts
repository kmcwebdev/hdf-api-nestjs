import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileACL } from 'src/common/enum/file/file-acl.enum';

export class FileUploadDTO {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(FileACL, {
    message: "ACL accepted values ['private', 'public-read']",
  })
  readonly security?: FileACL;
}
