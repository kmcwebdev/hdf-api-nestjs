import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { diffInMinutes } from 'src/common/utils/diff-in-minutes.util';
import { mailDomainIs } from 'src/common/utils/email-domain-check.util';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { UserType } from 'src/user/enum/user-type.enum';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  private refreshTokenKey: string;

  constructor(
    private prismaClientService: PrismaClientService,
    private jwtService: JwtService,
    private config: ConfigService<{ auth: { refreshTokenKey: string } }>,
  ) {
    this.refreshTokenKey = this.config.get<string>('auth.refreshTokenKey', {
      infer: true,
    });
  }

  async createJwtToken(id: number) {
    return await this.jwtService.signAsync(
      { id },
      { secret: this.refreshTokenKey },
    );
  }

  async signJwt(id: number) {
    return await this.jwtService.signAsync({ id });
  }

  async login(data: LoginDTO) {
    const { email, password } = data;

    const user = await this.prismaClientService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        userType: true,
        permissions: {
          select: {
            id: true,
            label: true,
            value: true,
          },
        },
        isLocked: true,
      },
    });

    if (user) {
      if (user.isLocked) {
        throw new UnauthorizedException('Your account is locked!');
      }

      if (await compare(password, user.password)) {
        return user;
      }
    }

    throw new UnauthorizedException('Invalid credentials!');
  }

  async forgotPassword(email: string) {
    if (mailDomainIs(email, 'kmc.solutions')) {
      throw new BadRequestException('Please reset your office 365 account');
    }

    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (user) {
      const fifteenMinutes = 15 * 60 * 1000;

      if (user.userType === UserType.Internal) {
        throw new BadRequestException(
          'Please change your office 365 password.',
        );
      }

      await this.prismaClientService.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: await this.createJwtToken(user.id),
          passwordResetTokenExpire: new Date(Date.now() + fifteenMinutes),
        },
      });

      return {
        message:
          'A password reset link has been sent to your registered email.',
      };
    }

    throw new NotFoundException('No user found with this email!');
  }

  async checkPasswordResetToken(passwordResetToken: string) {
    const user = await this.prismaClientService.user.findUnique({
      where: { passwordResetToken },
      select: {
        id: true,
        email: true,
        passwordResetToken: true,
        passwordResetTokenExpire: true,
      },
    });

    if (user) {
      if (diffInMinutes(user.passwordResetTokenExpire) <= 0) {
        throw new BadRequestException('Password reset token already expired!');
      }

      return user;
    }

    throw new NotFoundException('Password reset token not found!');
  }

  async changePassword(passwordResetToken: string, password: string) {
    const user = await this.checkPasswordResetToken(passwordResetToken);

    const hashedPassword = await hash(password, 10);

    await this.prismaClientService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(Date.now() - 1000),
        passwordResetToken: null,
        passwordResetTokenExpire: null,
      },
    });

    return { message: 'Password has been changed!' };
  }
}
