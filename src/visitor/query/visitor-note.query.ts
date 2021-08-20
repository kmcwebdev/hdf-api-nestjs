import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQuery } from '../../common/query/pagination.query';

export class PTVisitorNoteQuery extends PartialType(PaginationQuery) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly visitorId: number;
}
