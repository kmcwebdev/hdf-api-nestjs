import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateEventDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty()
  @IsDateString()
  dateFrom: Date;

  @ApiProperty()
  @IsDateString()
  dateTo: Date;

  @ApiProperty()
  @IsDateString()
  time: Date;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  siteId: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  floorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;
}
