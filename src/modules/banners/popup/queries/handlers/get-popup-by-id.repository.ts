import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "../../../../../infrastructure/drizzle/drizzle.service";
import GetPopupByIdQuery from "../impl/get-popup-by-id.query";
import { sql } from "drizzle-orm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { getProfileURL } from "../../utils/image-path.util";

@QueryHandler(GetPopupByIdQuery)
export class GetPopupByIdHandler implements IQueryHandler<GetPopupByIdQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.bannerPopups.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('get_popup_by_id');

  async execute({ id }: GetPopupByIdQuery) {
    try {
      const res = await this.prepared.execute({ id });
      if (!res) {
        // Popup not found
        return null;
      }

      if (res.image) {
        res.image = getProfileURL(res.image);
      }

      return { ...res };
    } catch (error) {
      // Handle any database or execution errors
      console.error("Error fetching popup:", error);
      throw new HttpException('ການດຶງຂໍ້ມູນມີບັນຫາ.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
