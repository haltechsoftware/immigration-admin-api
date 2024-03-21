import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetPopupQuery from "../impl/get-popup.query";
import { getProfileURL } from "../../utils/image-path.util";

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
    res.forEach(popup => {
        if (popup.image) {
          popup.image = getProfileURL(popup.image);
        }
    });

    return {...res}
  }
}