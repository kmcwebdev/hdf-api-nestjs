import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { AuthModule } from './auth/auth.module';
import authConfig from './common/config/auth.config';
import defaultEnv from './common/config/default.config';
import sendgridEnv from './common/config/sengrid.config';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { UserModule } from './user/user.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [
    RateLimiterModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultEnv, authConfig, sendgridEnv],
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        apiKey: config.get('sendGrid.apiKey'),
      }),
      inject: [ConfigService],
    }),
    PrismaClientModule,
    AuthModule,
    UserModule,
    VisitorModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor,
    },
  ],
})
export class AppModule {}
