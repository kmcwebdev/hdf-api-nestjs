import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as basicAuth from 'express-basic-auth';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as xss from 'xss-clean';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/serializer/exception/http.exception';
import { PrismaExceptionFilter } from './common/serializer/exception/prisma.exception';
import { PrismaClientService } from './prisma-client/prisma-client.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    hpp({
      whitelist: [],
    }),
  );
  app.use(helmet());
  app.use(xss());
  app.use(compression());

  app.use(
    ['/api-docs'],
    basicAuth({
      challenge: true,
      users: {
        admin: 'Love2eat',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MDF API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  const prismaClientService: PrismaClientService = app.get(PrismaClientService);

  prismaClientService.enableShutdownHooks(app);

  await app.listen(8989);
}
bootstrap();
