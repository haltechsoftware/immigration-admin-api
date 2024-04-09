import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { sql } from "drizzle-orm";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { GetOneHotelQuery } from "../imp/get-one.query";
import { NotFoundException } from "@nestjs/common";


@QueryHandler(GetOneHotelQuery)
export class GetOneHotelQueryHandler
  implements IQueryHandler<GetOneHotelQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}
  private prepared = this.drizzle
    .db()
    .query.hotels.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare('find_hotel_by_id');

  async execute({ id }: GetOneHotelQuery): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ໂຮງແຮມນີ້ບໍ່ມີໃນລະບົບ' });

    return res;
  }
}