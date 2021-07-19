import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/common/enum/user-type.enum';

export class InternalRegisterDTO {
  @ApiProperty({ type: String })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsEnum(UserType, { message: 'Choose between Internal or External.' })
  readonly userType: UserType;
}
