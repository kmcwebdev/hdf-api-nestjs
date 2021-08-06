import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as xss from 'xss-clean';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/serializer/exception/http.exception';
import { PrismaExceptionFilter } from './common/serializer/exception/prisma.exception';
import { PrismaClientService } from './prisma-client/prisma-client.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  if (process.env.NODE_ENV === 'development') {
    app.setGlobalPrefix('api');
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://hdf.kmc.solutions',
      'https://health-declaration.kmc.solutions',
    ],
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

  const config = new DocumentBuilder()
    .setTitle('HDF API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const prismaClientService: PrismaClientService = app.get(PrismaClientService);

  prismaClientService.enableShutdownHooks(app);

  await app.listen(5000);
}
bootstrap();
