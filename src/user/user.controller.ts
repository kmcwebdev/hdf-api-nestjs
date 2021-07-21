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
  ApiBadRequestResponse,
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
import {
  PTUpdateProfileDTO,
  UpdateProfileDTO,
} from 'src/common/dto/user/update-profile.dto';
import { EmailQuery } from 'src/common/query/email.query';
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

  @Get('check-internal-user-duplication')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'User is already registered or no user found',
  })
  checkInternalUserDuplication(@Query() { email }: EmailQuery) {
    return this.userService.checkInternalUserDuplication(email);
  }

  @Get('check-external-user-duplication')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'User is already registered or user is an internal email',
  })
  checkExternalUserDuplication(@Query() { email }: EmailQuery) {
    return this.userService.checkExternalUserDuplication(email);
  }

  @Patch('profile/:id?')
  @ApiParam({ name: 'id', required: false })
  @ApiBody({ type: UpdateProfileDTO })
  @ApiOkResponse({ description: 'Success' })
  updateProfile(
    @Req() req: Request,
    @Param('id', new DefaultValuePipe(0), ParseIntPipe) id: number,
    @Body() data: PTUpdateProfileDTO,
  ) {
    if (!id) id = req.user.id;

    return this.userService.updateProfile({ id, payload: data });
  }

  @Patch('lock/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  lockUser(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number) {
    return this.userService.lockUser({
      lockUserId: id,
      lockedById: req.user.id,
    });
  }

  @Patch('unlock/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  unLockUser(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number) {
    return this.userService.unlockUser({
      lockUserId: id,
      lockedById: req.user.id,
    });
  }

  @Post('register-internal')
  @ApiBody({ type: InternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerInternalUser(@Req() req: Request, @Body() data: InternalRegisterDTO) {
    return this.userService.registerInternalUser({
      userId: req.user.id,
      payload: data,
    });
  }

  @Post('register-external')
  @ApiBody({ type: ExternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerExternalUser(@Req() req: Request, @Body() data: ExternalRegisterDTO) {
    return this.userService.registerExternalUser({
      userId: req.user.id,
      payload: data,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.getUser(id);
  }
}
