import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
