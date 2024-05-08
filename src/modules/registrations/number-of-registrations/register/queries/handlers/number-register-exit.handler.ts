import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { NumberRegisterExitQuery } from '../impl/number-register-exit.query';

@QueryHandler(NumberRegisterExitQuery)
export class NumberRegisterExitHandler
  implements IQueryHandler<NumberRegisterExitQuery>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute(query: NumberRegisterExitQuery) {
    const perDay =
      (
        await this.redis.ts.GET('register_exit_per_day', {
          LATEST: true,
        })
      )?.value ?? 0;

    const perMouth =
      (
        await this.redis.ts.GET('register_exit_per_mouth', {
          LATEST: true,
        })
      )?.value ?? 0;

    const perYear =
      (
        await this.redis.ts.GET('register_exit_per_year', {
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
