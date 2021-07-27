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
import { UserType } from 'src/common/enum/user/user-type.enum';
import { PaginationQuery } from '../pagination.query';

export class PTUserQuery extends PartialType(PaginationQuery) {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserType)
  readonly userType: UserType;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isLocked: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly organization: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  @Validate(IsBeforeConstraint, ['createdTo'])
  createdFrom: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  createdTo: Date;
}
