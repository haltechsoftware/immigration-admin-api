import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "../../../../../infrastructure/drizzle/drizzle.service";
import GetPopupByIdQuery from "../impl/get-popup-by-id.query";
import { sql } from "drizzle-orm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { getProfileURL } from "../../utils/image-path.util";
import { DateTimeFormat } from "src/common/enum/date-time-fomat.enum";
import { format } from "date-fns";

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

      const data = {
        id: res.id,
        image: res.image,
        links: res.link, // Assuming res.links exists
        start_time: format(new Date(res.start_time), 'dd/MM/yyyy HH:mm:ss'), // Corrected format string
        end_time: format(new Date(res.end_time), 'dd/MM/yyyy HH:mm:ss'), // Corrected format string
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      return { data };
    } catch (error) {
      // Handle any database or execution errors
      console.error("Error fetching popup:", error);
      throw new HttpException('ການດຶງຂໍ້ມູນມີບັນຫາ.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
