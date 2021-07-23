import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQuery } from '../pagination.query';

export class PTEventQuery extends PartialType(PaginationQuery) {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly dateFrom: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly dateTo: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly time: Date;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly siteName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly floor: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly contactPerson: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly contactEmail: string;
}
