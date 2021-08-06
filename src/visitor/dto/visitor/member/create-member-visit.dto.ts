import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { QuestionDTO } from '../question.dto';

export class CreateMemberVisitorDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly company: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly travelLocations: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(3)
  readonly workTypeId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly leaveTypeId: number;

  @ApiProperty({ type: [QuestionDTO] })
  @IsArray()
  @ArrayMinSize(4)
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  readonly questions: QuestionDTO[];

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly siteId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly floorId: number;
}
