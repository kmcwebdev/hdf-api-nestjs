import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ExternalRegisterDTO } from 'src/common/dto/user/external-register.dto';
import { InternalRegisterDTO } from 'src/common/dto/user/internal-register.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOkResponse({ description: 'Success' })
  getUser(@Req() req: Request) {
    return this.userService.getUser(req.user.id);
  }

  @Post('register-external')
  @ApiBody({ type: ExternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerExternalUser(@Body() data: ExternalRegisterDTO) {
    return this.userService.registerExternalUser(data);
  }

  @Post('register-internal')
  @ApiBody({ type: InternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerInternalUser(@Body() data: InternalRegisterDTO) {
    return this.userService.registerInternalUser(data);
  }
}
