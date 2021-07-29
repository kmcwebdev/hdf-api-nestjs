import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { UpdateUserPermissionDTO } from 'src/common/dto/user/update-user-permission.dto';
import { EmailQuery } from 'src/common/query/email.query';
import { PTUserQuery } from 'src/common/query/user/user.query';
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

  @Get('permissions')
  @ApiOkResponse({ description: 'Success' })
  getUserPermissions() {
    return this.userService.getUserPermissions();
  }

  @Patch('permissions/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiBody({ type: UpdateUserPermissionDTO })
  @ApiOkResponse({ description: 'Success' })
  connectUserPermissions(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateUserPermissionDTO,
  ) {
    return this.userService.updateUserPermissions({
      method: req.method as 'PATCH',
      userId: id,
      payload: data,
    });
  }

  @Delete('permissions/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiBody({ type: UpdateUserPermissionDTO })
  @ApiOkResponse({ description: 'Success' })
  disconnectUserPermissions(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateUserPermissionDTO,
  ) {
    return this.userService.updateUserPermissions({
      method: req.method as 'DELETE',
      userId: id,
      payload: data,
    });
  }

  @Post('internal')
  @ApiBody({ type: InternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerInternalUser(@Req() req: Request, @Body() data: InternalRegisterDTO) {
    return this.userService.registerInternalUser({
      userId: req.user.id,
      payload: data,
    });
  }

  @Post('external')
  @ApiBody({ type: ExternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerExternalUser(@Req() req: Request, @Body() data: ExternalRegisterDTO) {
    return this.userService.registerExternalUser({
      userId: req.user.id,
      payload: data,
    });
  }

  @Get('internal-duplication')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'User is already registered or no user found',
  })
  checkInternalUserDuplication(@Query() { email }: EmailQuery) {
    return this.userService.checkInternalUserDuplication(email);
  }

  @Get('external-duplication')
  @ApiQuery({ type: EmailQuery })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: 'User is already registered or user is an internal email',
  })
  checkExternalUserDuplication(@Query() { email }: EmailQuery) {
    return this.userService.checkExternalUserDuplication(email);
  }

  @Patch('profile/:id?')
  @ApiParam({
    name: 'id',
    required: false,
    description: 'User id',
  })
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
  lockUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.lockUser(id);
  }

  @Patch('unlock/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  unLockUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.unlockUser(id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.getUser(id);
  }
}
