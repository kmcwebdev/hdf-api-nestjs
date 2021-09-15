import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ChangePasswordDTO } from 'src/auth/dto/change-password.dto';
import { cookie } from 'src/common/config/cookie.config';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { LoginDTO } from './dto/login.dto';
import { ResetTokenDTO } from './dto/reset-token.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: 'Success' })
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { user } = req;

    const token = await this.authService.signJwt(user.id);

    res.cookie('accessToken', token, cookie());

    return {
      id: user.id,
      email: user.email,
      userType: user.userType,
      isLocked: user.isLocked,
      permissions: user.permissions,
      token,
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Success' })
  signOut(@Res() res: Response) {
    res.clearCookie('accessToken');

    res.send({ message: 'sign out Successfully!' });
  }

  @Get('login-state')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success' })
  loginState() {
    return { validSession: true };
  }

  @Post('forgot-password')
  @ApiQuery({ type: ForgotPasswordDTO })
  async forgotPasswordByUsername(@Query() { email }: ForgotPasswordDTO) {
    return this.authService.forgotPassword(email);
  }

  @Get('password-reset-token')
  @ApiQuery({ type: ResetTokenDTO })
  @ApiOkResponse({ description: 'Success' })
  checkPasswordResetToken(@Query() { resetToken }: ResetTokenDTO) {
    return this.authService.checkPasswordResetToken(resetToken);
  }

  @Patch('change-password/:resetToken')
  @ApiParam({ name: 'resetToken' })
  @ApiBody({ type: ChangePasswordDTO })
  @ApiOkResponse({ description: 'Success' })
  changePassword(
    @Param() { resetToken }: ResetTokenDTO,
    @Body() data: ChangePasswordDTO,
  ) {
    return this.authService.changePassword(resetToken, data.password);
  }
}
