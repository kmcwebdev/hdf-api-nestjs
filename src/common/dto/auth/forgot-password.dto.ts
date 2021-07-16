import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({ type: String })
  @IsEmail()
  readonly email: string;
}
