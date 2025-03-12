import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { NumberRegisterEnterClientQuery } from "../impl/number-register-enter-client.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { and, between, eq, sum } from "drizzle-orm";
import { format, subDays, subMonths, subYears } from "date-fns";
import { timeSeries } from "src/modules/registrations/entities";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";

// Ensure 'type_register' matches ENUM values (string literals)
type TimeSeriesType = "register-enter" | "register-exit"; 

@QueryHandler(NumberRegisterEnterClientQuery)
export class NumberRegisterEnterClientHandler
  implements IQueryHandler<NumberRegisterEnterClientQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(query: NumberRegisterEnterClientQuery) {
    const db = this.drizzle.db(); // ✅ Call it as a function
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, DateTimeFormat.Timestamp);

    const getRegisterCount = async (type_register: TimeSeriesType, period: "day" | "month" | "year") => {
      const startDate =
        period === "day"
          ? subDays(currentDate, 1)
          : period === "month"
          ? subMonths(currentDate, 1)
          : subYears(currentDate, 1);

      const result = await db
        .select({
          value: sum(timeSeries.number).mapWith(Number),
        })
        .from(timeSeries)
        .where(
          and(
            eq(timeSeries.type, type_register),
            between(
              timeSeries.timestamp,
              format(startDate, DateTimeFormat.Timestamp),
              formattedCurrentDate
            )
          )
        )
        .groupBy(timeSeries.type);

      return result.length > 0 ? result[0].value : 0;
    };

    const enterPerDay = await getRegisterCount("register-enter", "day");
    const enterPerMonth = await getRegisterCount("register-enter", "month");
    const enterPerYear = await getRegisterCount("register-enter", "year");

    const exitPerDay = await getRegisterCount("register-exit", "day");
    const exitPerMonth = await getRegisterCount("register-exit", "month");
    const exitPerYear = await getRegisterCount("register-exit", "year");

    return {
      enterPerDay,
      enterPerMonth,
      enterPerYear,
      exitPerDay,
      exitPerMonth,
      exitPerYear,
    };
  }
}
