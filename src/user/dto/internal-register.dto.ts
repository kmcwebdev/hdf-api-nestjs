import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InternalRegisterDTO {
  @ApiProperty({ type: String })
  @IsEmail()
  readonly email: string;
}
