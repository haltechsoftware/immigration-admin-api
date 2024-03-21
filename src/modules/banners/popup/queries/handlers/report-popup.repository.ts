import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetPopupQuery from "../impl/get-popup.query";
import { getProfileURL } from "../../utils/image-path.util";
import GetReportPopupQuery from "../impl/report-popup.query";
import { SQL, count, sql } from "drizzle-orm";
import { between } from "drizzle-orm";
import { bannerPopups } from "src/modules/banners/entities";


@QueryHandler(GetReportPopupQuery)
export class GetReportPopupHandler implements IQueryHandler<GetReportPopupQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private _prepared = this.drizzle
  .db()
  .select({ value: count() })
  .from(bannerPopups)
  .prepare('count_popups');

  
  async execute({ query: { limit, offset, start_time, end_time } }: GetReportPopupQuery): Promise<any> {
    console.log(limit, offset, start_time, end_time);
    // const res = await this.drizzle.db().query.bannerPopups.findMany({
    //   orderBy: ({ id }, { desc }) => [desc(id)],
    //   limit,
    //   offset,
    // });

    if (start_time && end_time) {
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      console.log(startDate, endDate);
      // Convert Date objects to ISO string format
      const startTimeISO = startDate.toISOString();
      const endTimeISO = endDate.toISOString();
      const queryBuilder = await this.drizzle.db().query.bannerPopups.findMany({
        where: sql`${bannerPopups.is_private} = ${false} AND DATE(${bannerPopups.start_time}) >= ${startTimeISO} AND DATE(${bannerPopups.start_time}) <= ${endTimeISO}`,
        orderBy: ({ id }, { desc }) => [desc(id)],
        limit,
        offset,
      });

      return {data: queryBuilder};
    }
    const res = await this.drizzle.db().query.bannerPopups.findMany({
      orderBy: ({ id }, { desc }) => [desc(id)],
      limit,
      offset,
    });
    return {data: res}
  }
}