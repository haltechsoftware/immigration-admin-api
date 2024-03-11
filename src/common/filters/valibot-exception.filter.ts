import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValiError, flatten } from 'valibot';

@Catch()
export class ValibotExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let responseBody: any;
    let status: number;

    if (exception instanceof ValiError) {
      responseBody = {
        message: 'ການກວດສອບລົ້ມເຫລວ',
        ...flatten(exception),
      };
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
      status = exception.getStatus();
    } else {
      responseBody = {
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      console.error(exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
