import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { ValibotExceptionsFilter } from './common/filters/valibot-exception.filter';
import * as express from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 'loopback');
  app.enableCors({ origin: '*' });

  if (!existsSync('client')) mkdirSync('client');

  app.use('/client', express.static(join(__dirname, '..', 'client')));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ValibotExceptionsFilter(httpAdapter));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
