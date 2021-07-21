import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class QuestionDTO {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  readonly questionId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly answer: string;
}
