import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { S3Module } from 'nestjs-s3';
import { AuthModule } from './auth/auth.module';
import { AzureGraphApiModule } from './azure-graph-api/azure-graph-api.module';
import authEnv from './common/config/auth.config';
import erpEnv from './common/config/erp.config';
import s3Env from './common/config/s3.config';
import sendgridEnv from './common/config/sengrid.config';
import { EventModule } from './event/event.module';
import { FileModule } from './file/file.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { QuestionModule } from './question/question.module';
import { SiteModule } from './site/site.module';
import { UserModule } from './user/user.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authEnv, erpEnv, s3Env, sendgridEnv],
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        apiKey: config.get('sendGrid.apiKey'),
      }),
      inject: [ConfigService],
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        config: config.get('s3.awsConfig'),
      }),
      inject: [ConfigService],
    }),
    PrismaClientModule,
    AzureGraphApiModule,
    QuestionModule,
    AuthModule,
    UserModule,
    VisitorModule,
    EventModule,
    SiteModule,
    FileModule,
  ],
})
export class AppModule {}
