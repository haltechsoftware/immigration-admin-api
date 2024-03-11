import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ObjectSchema, parse } from 'valibot';

export const ValibotFactory = (
  value: {
    schema: ObjectSchema<any>;
    type?: 'query' | 'params' | 'body';
  },
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest();

  return parse(value.schema, request[value.type ? value.type : 'body']);
};

export const Valibot = createParamDecorator(ValibotFactory);
