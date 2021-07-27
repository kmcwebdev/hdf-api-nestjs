import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class S3DeleteFileDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  readonly fileKey: string;
}
