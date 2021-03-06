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
  ValidateNested,
} from 'class-validator';
import { QuestionDTO } from '../question.dto';

export class CreateGuestVisitorDTO {
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

  @ApiProperty({ type: [QuestionDTO] })
  @IsArray()
  @ArrayMinSize(4)
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  readonly questions: QuestionDTO[];

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  readonly siteId: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  readonly floorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly poc: string;

  @ApiProperty()
  @IsEmail()
  readonly pocEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly purposeOfVisit: string;
}
