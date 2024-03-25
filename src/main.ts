import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { ValibotExceptionsFilter } from './common/filters/valibot-exception.filter';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  if (!existsSync('client')) mkdirSync('client');

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ValibotExceptionsFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
