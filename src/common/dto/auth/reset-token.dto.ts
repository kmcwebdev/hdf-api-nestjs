import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetTokenDTO {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(64)
  @MaxLength(64)
  readonly resetToken: string;
}
