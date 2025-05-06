import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { and, between, eq, sum } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { timeSeries } from 'src/modules/registrations/entities';
import { VisitorQuery } from '../impl/visitor.query';

@QueryHandler(VisitorQuery)
export class VisitorHandler
  implements IQueryHandler<VisitorQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(query: VisitorQuery) {
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
          eq(timeSeries.type, 'visitor'),
          between(
            timeSeries.timestamp,
            format(subDays(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

      const visitorPerWeek = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, "visitor"),
          between(
            timeSeries.timestamp,
            format(subWeeks(currentDate, 1), DateTimeFormat.Timestamp),
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
          eq(timeSeries.type, 'visitor'),
          between(
            timeSeries.timestamp,
            format(subMonths(currentDate, 1), DateTimeFormat.Timestamp),
            formattedCurrentDate,
          ),
        ),
      )
      .groupBy(timeSeries.type);

    const total = await this.drizzle
      .db()
      .select({
        value: sum(timeSeries.number).mapWith(Number),
      })
      .from(timeSeries)
      .where(
        and(
          eq(timeSeries.type, 'visitor'),
        ),
      )
      .groupBy(timeSeries.type);

    return {
      per_day: perDay.length > 0 ? perDay[0].value : 0,
      per_week: visitorPerWeek.length > 0 ? visitorPerWeek[0].value : 0,
      per_mouth: perMouth.length > 0 ? perMouth[0].value : 0,
      total: total.length > 0 ? total[0].value : 0,
    };
  }
}
