import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint } from 'src/common/decorator/constraint-validator.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { PaginationQuery } from '../../common/query/pagination.query';

export class PTUserQuery extends PartialType(PaginationQuery) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(UserType)
  readonly userType: UserType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isLocked: boolean;

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
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly organization: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  @Validate(IsBeforeConstraint, ['createdTo'])
  readonly createdFrom: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly createdTo: Date;
}
