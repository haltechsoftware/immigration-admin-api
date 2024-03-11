import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { MergeDrizzleToReqInterceptor } from './merge-drizzle-to-req.interceptor';

describe('MergeParamToBodyInterceptor', () => {
  const mockDrizzleService: DrizzleService | any = {};
  const interceptor = new MergeDrizzleToReqInterceptor(mockDrizzleService);

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should merge drizzle service to request object', () => {
    const mockRequest: any = {};

    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockNext: CallHandler<any> = {
      handle: () => new Observable(),
    };

    interceptor.intercept(mockContext, mockNext);

    expect(mockRequest.drizzle).toBe(mockDrizzleService);
  });
});
