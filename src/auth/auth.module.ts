import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { rateLimitExceeded } from 'src/common/serializer/response/rate-limit.response';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local-auth.strategy';

@Module({
  imports: [
    RateLimiterModule.register({
      keyPrefix: 'global-auth',
      points: 150,
      duration: 300,
      customResponseSchema: () => rateLimitExceeded(),
    }),
    PrismaClientModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.accessTokenSecretKey'),
        signOptions: {
          expiresIn: configService.get<string>('auth.accessTokenExpires'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
