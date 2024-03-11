import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';

@Injectable()
export class MergeDrizzleToReqInterceptor implements NestInterceptor {
  constructor(private drizzle: DrizzleService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    req.drizzle = this.drizzle;

    return next.handle();
  }
}
