import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RedisClientType } from 'redis';
import { REDIS_PROVIDER } from 'src/infrastructure/redis/inject-key';
import { NumberTouristEnterQuery } from '../impl/number-tourist-enter.query';

@QueryHandler(NumberTouristEnterQuery)
export class NumberTouristEnterHandler
  implements IQueryHandler<NumberTouristEnterQuery>
{
  constructor(
    @Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
  ) {}

  async execute(query: NumberTouristEnterQuery) {
    const touristPerDay =
      (
        await this.redis.ts.GET('tourists_enter_per_day', {
          LATEST: true,
        })
      )?.value ?? 0;

    const touristPerWeek =
      (
        await this.redis.ts.GET('tourists_enter_per_week', {
          LATEST: true,
        })
      )?.value ?? 0;

    const touristPerYear =
      (
        await this.redis.ts.GET('tourists_enter_per_year', {
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
