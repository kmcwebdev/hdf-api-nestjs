import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetTokenDTO {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(137, { message: 'Invalid reset token' })
  @MaxLength(137, { message: 'Invalid reset token' })
  readonly resetToken: string;
}
