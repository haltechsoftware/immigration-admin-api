import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetReportArrivalQuery from '../impl/report-arrival.query';
import { arrivalRegistration } from 'src/modules/registrations/entities';

@QueryHandler(GetReportArrivalQuery)
export class GetReportArrivalHandler
  implements IQueryHandler<GetReportArrivalQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const allCountArrivalResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration);

    const toDayCountArrivalResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(sql`DATE(${arrivalRegistration.created_at}) = DATE(${today})`);

    // Count tourism arrivals in last 30 days
    const thirtyDaysCountArrivalResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(
        sql`DATE(${arrivalRegistration.created_at}) >= DATE(${thirtyDaysAgo})`,
      );

    // Count tourism arrivals in last 1 year
    const oneYearCountArrivalResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(
        sql`DATE(${arrivalRegistration.created_at}) >= DATE(${oneYearAgo})`,
      );

    // Count all tourism arrivals (no date filter)
    const allCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(sql`${arrivalRegistration.purpose} = 'tourism'`);

    // Count tourism arrivals today
    const todayCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(
        sql`${arrivalRegistration.purpose} = 'tourism' AND DATE(${arrivalRegistration.created_at}) = DATE(${today})`,
      );

    // Count tourism arrivals in last 30 days
    const thirtyDaysCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(
        sql`${arrivalRegistration.purpose} = 'tourism' AND DATE(${arrivalRegistration.created_at}) >= DATE(${thirtyDaysAgo})`,
      );

    // Count tourism arrivals in last 1 year
    const oneYearCountResult = await this.drizzle
      .db()
      .select({ value: count() })
      .from(arrivalRegistration)
      .where(
        sql`${arrivalRegistration.purpose} = 'tourism' AND DATE(${arrivalRegistration.created_at}) >= DATE(${oneYearAgo})`,
      );

    return {
      total_arrival_today: toDayCountArrivalResult[0].value,
      total_arrival_month_days: thirtyDaysCountArrivalResult[0].value,
      total_arrival_one_year: oneYearCountArrivalResult[0].value,
      total_arrival_all: allCountArrivalResult[0].value,
      total_arrival_tourism_today: todayCountResult[0].value,
      total_arrival_tourism_month_days: thirtyDaysCountResult[0].value,
      total_arrival_tourism_one_year: oneYearCountResult[0].value,
      total_arrival_tourism_all: allCountResult[0].value,
    };
  }
}
