import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { AuthModule } from './auth/auth.module';
import { AzureGraphApiModule } from './azure-graph-api/azure-graph-api.module';
import authEnv from './common/config/auth.config';
import defaultEnv from './common/config/default.config';
import erpEnv from './common/config/erp.config';
import sendgridEnv from './common/config/sengrid.config';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { UserModule } from './user/user.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [
    RateLimiterModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultEnv, authEnv, sendgridEnv, erpEnv],
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        apiKey: config.get('sendGrid.apiKey'),
      }),
      inject: [ConfigService],
    }),
    PrismaClientModule,
    AzureGraphApiModule,
    AuthModule,
    UserModule,
    VisitorModule,
  ],
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: RateLimiterInterceptor,
  //   },
  // ],
})
export class AppModule {}
