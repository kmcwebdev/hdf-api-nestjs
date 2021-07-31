import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class QuestionDTO {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  readonly questionId: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  readonly answers: string[];
}
