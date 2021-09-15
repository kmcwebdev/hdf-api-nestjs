import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { Jwt } from '../interface/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService<{ auth: { accessTokenSecretKey: string } }>,
    private prismaClientService: PrismaClientService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req?.cookies?.accessToken) {
            return req.cookies.accessToken;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('auth.accessTokenSecretKey', {
        infer: true,
      }),
    });
  }

  async validate(payload: Jwt) {
    return await this.prismaClientService.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        isLocked: true,
        userType: true,
        passwordChangedAt: true,
      },
    });
  }
}
