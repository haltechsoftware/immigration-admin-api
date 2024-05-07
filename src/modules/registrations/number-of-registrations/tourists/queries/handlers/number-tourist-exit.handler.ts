import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { NumberTouristExitQuery } from '../impl/number-tourist-exit.query';

@QueryHandler(NumberTouristExitQuery)
export class NumberTouristExitHandler
  implements IQueryHandler<NumberTouristExitQuery>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute(query: NumberTouristExitQuery) {
    const touristPerDay =
      (
        await this.redis.ts.GET('tourists_exit_per_day', {
          LATEST: true,
        })
      )?.value ?? 0;

    const touristPerWeek =
      (
        await this.redis.ts.GET('tourists_exit_per_week', {
          LATEST: true,
        })
      )?.value ?? 0;

    const touristPerYear =
      (
        await this.redis.ts.GET('tourists_exit_per_year', {
          LATEST: true,
        })
      )?.value ?? 0;

    return {
      per_day: touristPerDay,
      per_week: touristPerWeek,
      per_year: touristPerYear,
    };
  }
}
