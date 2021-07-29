import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsInt } from 'class-validator';

class SubEmail {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  visitorId: number;

  @ApiProperty()
  @IsEmail()
  email: string;
}

export class CreateSubEmailsDTO {
  @ApiProperty({ type: [SubEmail] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => SubEmail)
  subEmails: SubEmail[];
}
