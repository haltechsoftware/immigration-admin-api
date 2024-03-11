import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { vi } from 'vitest';
import { MergeParamToBodyInterceptor } from './merge-param-to-body.interceptor';

describe('MergeParamToBodyInterceptor', () => {
  let interceptor: MergeParamToBodyInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MergeParamToBodyInterceptor],
    }).compile();

    interceptor = module.get<MergeParamToBodyInterceptor>(
      MergeParamToBodyInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should merge param to body', async () => {
    const mockReq = {
      body: { existingBodyField: 'existingValue' },
      params: { newField: 'newValue' },
    };

    const mockContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue(mockReq),
      }),
    } as unknown as ExecutionContext;

    const mockHandler = {
      handle: vi.fn().mockReturnValue(new Observable()),
    } as unknown as CallHandler;

    interceptor.intercept(mockContext, mockHandler);

    expect(mockReq.body).toEqual({
      existingBodyField: 'existingValue',
      newField: 'newValue',
    });
  });
});
