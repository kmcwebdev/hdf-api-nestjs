import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsOptional } from 'class-validator';
import { PaginationQuery } from '../../common/query/pagination.query';

export class PTTemperatureChecklistQuery extends PartialType(PaginationQuery) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly visitorId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly temperature: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly dateFrom: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly dateTo: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly timeFrom: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly timeTo: Date;
}
