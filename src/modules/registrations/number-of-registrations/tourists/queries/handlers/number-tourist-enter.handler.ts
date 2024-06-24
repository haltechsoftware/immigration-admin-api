import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { and, between, eq, sum } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { NumberTouristEnterQuery } from '../impl/number-tourist-enter.query';

@QueryHandler(NumberTouristEnterQuery)
export class NumberTouristEnterHandler
  implements IQueryHandler<NumberTouristEnterQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(query: NumberTouristEnterQuery) {
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, DateTimeFormat.Timestamp);

    const touristPerDay = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'tourists-enter'),
          between(
            timeSeries.timestamp,
            format(subDays(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    const touristPerMouth = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'tourists-enter'),
          between(
            timeSeries.timestamp,
            format(subMonths(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    const touristPerYear = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'tourists-enter'),
          between(
            timeSeries.timestamp,
            format(subYears(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    return {
      per_day: touristPerDay.length > 0 ? touristPerDay[0].value : 0,
      per_mouth: touristPerMouth.length > 0 ? touristPerMouth[0].value : 0,
      per_year: touristPerYear.length > 0 ? touristPerYear[0].value : 0,
    };
  }
}
