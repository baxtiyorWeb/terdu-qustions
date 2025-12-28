import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.enableCors({
    origin: ['http://localhost:3000', 'terdu-questions.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NoteShare API')
    .setDescription('Official API documentation for NoteShare backend.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.use(
    '/api/docs',
    express.static(join(__dirname, '../node_modules/swagger-ui-dist')),
  );

  app.set('trust proxy', 1);

  const port = process.env.PORT ?? 4040;
  await app.listen(port);
  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`📘 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
