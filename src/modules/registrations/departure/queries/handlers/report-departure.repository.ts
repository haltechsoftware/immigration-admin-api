import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { departureRegistration } from 'src/modules/registrations/entities';
import GetReportDepartureQuery from '../impl/report-departure.query';

@QueryHandler(GetReportDepartureQuery)
export class GetReportDepartureHandler
  implements IQueryHandler<GetReportDepartureQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Count all tourism arrivals (no date filter)
    const allCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(departureRegistration);

    // Count tourism arrivals today
    const todayCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(departureRegistration)
      .where(sql`DATE(${departureRegistration.created_at}) = DATE(${today})`);

    // Count tourism arrivals in last 30 days
    const thirtyDaysCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(departureRegistration)
      .where(
        sql`DATE(${departureRegistration.created_at}) >= DATE(${thirtyDaysAgo})`,
      );

    // Count tourism arrivals in last 1 year
    const oneYearCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(departureRegistration)
      .where(
        sql`DATE(${departureRegistration.created_at}) >= DATE(${oneYearAgo})`,
      );

    return {
      total_departure_tourism_today: todayCountResult[0].value,
      total_departure_tourism_month_days: thirtyDaysCountResult[0].value,
      total_departure_tourism_one_year: oneYearCountResult[0].value,
      total_departure_tourism_all: allCountResult[0].value,
    };
  }
}
