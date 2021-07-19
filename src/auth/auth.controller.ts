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
import { cookie } from 'src/common/config/cokie.config';
import { ChangePasswordDTO } from 'src/common/dto/auth/change-password.dto';
import { ForgotPasswordDTO } from 'src/common/dto/auth/forgot-password.dto';
import { LoginDTO } from 'src/common/dto/auth/login.dto';
import { ResetTokenDTO } from 'src/common/dto/auth/reset-token.dto';
import { AuthService } from './auth.service';
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

    res.send({
      id: user.id,
      userType: user.userType,
      isLocked: user.isLocked,
      token,
    });
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
