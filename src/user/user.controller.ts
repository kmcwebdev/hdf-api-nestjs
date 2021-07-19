import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from 'src/common/dto/auth/register.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  register(@Body() data: RegisterDTO) {
    return this.userService.register(data);
  }
}
