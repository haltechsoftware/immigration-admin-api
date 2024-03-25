import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetPopupQuery from "../impl/get-popup.query";
import { getProfileURL } from "../../utils/image-path.util";
import GetReportPopupQuery from "../impl/report-popup.query";
import { SQL, count, sql } from "drizzle-orm";
import { between } from "drizzle-orm";
import { bannerPopups } from "src/modules/banners/entities";
import { format } from "date-fns";


@QueryHandler(GetReportPopupQuery)
export class GetReportPopupHandler implements IQueryHandler<GetReportPopupQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ query: { limit, offset, start_time, end_time } }: GetReportPopupQuery): Promise<any> {
    let res;

    if (start_time && end_time) {
      const startDate = new Date(start_time);
      const endDate = new Date(end_time);
      
      const startTimeISO = startDate.toISOString();
      const endTimeISO = endDate.toISOString();
      res = await this.drizzle.db().query.bannerPopups.findMany({
        where: sql`${bannerPopups.is_private} = ${false} AND DATE(${bannerPopups.start_time}) >= ${startTimeISO} AND DATE(${bannerPopups.start_time}) <= ${endTimeISO}`,
        orderBy: ({ id }, { desc }) => [desc(id)],
        limit,
        offset,
      });
    } else {
      res = await this.drizzle.db().query.bannerPopups.findMany({
        orderBy: ({ id }, { desc }) => [desc(id)],
        limit,
        offset,
      });
    }

    // Format dates and modify image URLs
    const formattedData = res.map(popup => {
      if (popup.image) {
        popup.image = getProfileURL(popup.image);
      }
      return {
        id: popup.id,
        image: popup.image,
        links: popup.link,
        start_time: format(new Date(popup.start_time), 'dd/MM/yyyy HH:mm:ss'),
        end_time: format(new Date(popup.end_time), 'dd/MM/yyyy HH:mm:ss'),
        created_at: popup.created_at,
        updated_at: popup.updated_at,
      };
    });

    return { data: formattedData };
  }
}