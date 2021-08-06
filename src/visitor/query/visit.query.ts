import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint } from 'src/common/decorator/constraint-validator.decorator';
import { PaginationQuery } from 'src/common/query/pagination.query';

export class PTVisitQuery extends PartialType(PaginationQuery) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly guest: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly siteId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly tag: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  @Validate(IsBeforeConstraint, ['dateTo'])
  readonly dateFrom: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly dateTo: Date;
}
