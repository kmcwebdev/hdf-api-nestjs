import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ExternalRegisterDTO } from 'src/common/dto/user/external-register.dto';
import { InternalRegisterDTO } from 'src/common/dto/user/internal-register.dto';
import { PTUpdateProfileDTO } from 'src/common/dto/user/update-profile.dto';
import { PTUserQuery } from 'src/common/query/user.query';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({ type: PTUserQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getUsers(@Query() query: PTUserQuery) {
    return this.userService.getUsers(query);
  }

  @Get('me')
  @ApiOkResponse({ description: 'Success' })
  getMe(@Req() req: Request) {
    return this.userService.getUser(req.user.id);
  }

  @Patch('profile/:id?')
  @ApiParam({ name: 'id', required: false })
  @ApiBody({ type: PTUpdateProfileDTO })
  @ApiOkResponse({ description: 'Success' })
  updateProfile(
    @Req() req: Request,
    @Param('id', new DefaultValuePipe(0), ParseIntPipe) id: number,
    @Body() data: PTUpdateProfileDTO,
  ) {
    if (!id) id = req.user.id;

    return this.userService.updateProfile({ id, payload: data });
  }

  @Post('register-internal')
  @ApiBody({ type: InternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerInternalUser(@Body() data: InternalRegisterDTO) {
    return this.userService.registerInternalUser(data);
  }

  @Post('register-external')
  @ApiBody({ type: ExternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerExternalUser(@Body() data: ExternalRegisterDTO) {
    return this.userService.registerExternalUser(data);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.getUser(id);
  }
}
