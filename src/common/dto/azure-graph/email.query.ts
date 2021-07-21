import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailQuery {
  @ApiProperty()
  @IsEmail()
  email: string;
}
