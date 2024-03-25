import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetPopupQuery from "../impl/get-popup.query";
import { getProfileURL } from "../../utils/image-path.util";
import { format } from "date-fns";

@QueryHandler(GetPopupQuery)
export class GetPopupHandler implements IQueryHandler<GetPopupQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ paginate: { offset, limit } }: GetPopupQuery) {
    const res = await this.drizzle.db().query.bannerPopups.findMany({
        orderBy: ({ id }, { desc }) => [desc(id)],
        limit,
        offset,
    });

    // ຕໍ່ path ຮູບ
    const data = res.map(popup => {
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

    return {data};
  }
}