import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { and, between, eq, sum } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { NumberRegisterExitQuery } from '../impl/number-register-exit.query';

@QueryHandler(NumberRegisterExitQuery)
export class NumberRegisterExitHandler
  implements IQueryHandler<NumberRegisterExitQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(query: NumberRegisterExitQuery) {
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, DateTimeFormat.Timestamp);

    const perDay = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'register-exit'),
          between(
            timeSeries.timestamp,
            format(subDays(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    const perMouth = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'register-exit'),
          between(
            timeSeries.timestamp,
            format(subMonths(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    const perYear = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'register-exit'),
          between(
            timeSeries.timestamp,
            format(subYears(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    return {
      per_day: perDay.length > 0 ? perDay[0].value : 0,
      per_mouth: perMouth.length > 0 ? perMouth[0].value : 0,
      per_year: perYear.length > 0 ? perYear[0].value : 0,
    };
  }
}
