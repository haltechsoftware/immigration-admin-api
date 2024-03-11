import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ObjectSchemaAsync, parseAsync } from 'valibot';

export const ValibotAsyncFactory = async (
  value: {
    schema: ObjectSchemaAsync<any>;
    type?: 'query' | 'params' | 'body';
  },
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest();

  return await parseAsync(
    value.schema,
    request[value.type ? value.type : 'body'],
  );
};

export const ValibotAsync = createParamDecorator(ValibotAsyncFactory);
