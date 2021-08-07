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
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ExternalRegisterDTO } from 'src/user/dto/external-register.dto';
import { PTUserQuery } from 'src/user/query/user.query';
import { InternalRegisterDTO } from './dto/internal-register.dto';
import { PTUpdateProfileDTO, UpdateProfileDTO } from './dto/update-profile.dto';
import { UpdateUserPermissionDTO } from './dto/update-user-permission.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @Get()
  @ApiQuery({ type: PTUserQuery, required: false })
  @ApiOkResponse({ description: 'Success' })
  getUsers(@Query() query: PTUserQuery) {
    return this.userService.getUsers(query);
  }

  @ApiTags('User')
  @Get('me')
  @ApiOkResponse({ description: 'Success' })
  getMe(@Req() req: Request) {
    return this.userService.getUser(req.user.id);
  }

  @ApiTags('Registration')
  @Post('internal')
  @ApiBody({ type: InternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerInternalUser(@Req() req: Request, @Body() data: InternalRegisterDTO) {
    return this.userService.registerInternalUser({
      userId: req.user.id,
      payload: data,
    });
  }

  @ApiTags('Registration')
  @Post('external')
  @ApiBody({ type: ExternalRegisterDTO })
  @ApiCreatedResponse({ description: 'Created' })
  registerExternalUser(@Req() req: Request, @Body() data: ExternalRegisterDTO) {
    return this.userService.registerExternalUser({
      userId: req.user.id,
      payload: data,
    });
  }

  @ApiTags('Permission')
  @Get('permissions')
  @ApiOkResponse({ description: 'Success' })
  getUserPermissions() {
    return this.userService.getUserPermissions();
  }

  @ApiTags('Permission')
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

  @ApiTags('Permission')
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

  @ApiTags('User')
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

  @ApiTags('User')
  @Patch('lock/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  lockUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.lockUser(id);
  }

  @ApiTags('User')
  @Patch('unlock/:id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  unLockUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.unlockUser(id);
  }

  @ApiTags('User')
  @Get(':id')
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Success' })
  getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.getUser(id);
  }
}
