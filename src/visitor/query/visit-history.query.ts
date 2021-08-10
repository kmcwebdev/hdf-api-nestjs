import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/common/query/pagination.query';

export class PTVisitHistoryQuery extends PartialType(PaginationQuery) {
  @ApiProperty({ required: true })
  @IsInt()
  @Type(() => Number)
  readonly visitorId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly siteId: number;

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
