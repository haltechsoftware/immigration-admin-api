import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { NumberRegisterEnterQuery } from '../impl/number-register-enter.query';

@QueryHandler(NumberRegisterEnterQuery)
export class NumberRegisterEnterHandler
  implements IQueryHandler<NumberRegisterEnterQuery>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute(query: NumberRegisterEnterQuery) {
    const perDay =
      (
        await this.redis.ts.GET('register_enter_per_day', {
          LATEST: true,
        })
      )?.value ?? 0;

    const perMouth =
      (
        await this.redis.ts.GET('register_enter_per_mouth', {
          LATEST: true,
        })
      )?.value ?? 0;

    const perYear =
      (
        await this.redis.ts.GET('register_enter_per_year', {
          LATEST: true,
        })
      )?.value ?? 0;

    return {
      per_day: perDay,
      per_mouth: perMouth,
      per_year: perYear,
    };
  }
}
