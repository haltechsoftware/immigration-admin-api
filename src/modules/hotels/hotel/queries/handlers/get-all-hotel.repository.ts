import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { GetAllHotelQuery } from "../imp/get-all.query";
import { and, count, eq } from "drizzle-orm";
import { hotels } from "src/modules/hotels/entities";

@QueryHandler(GetAllHotelQuery)
export class GetAllHotelQueryHandler
  implements IQueryHandler<GetAllHotelQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  async execute({
    input: { offset, limit, is_published },
  }: GetAllHotelQuery): Promise<any> {
        const isPrivateCondition =
        is_published !== undefined
            ? eq(hotels.is_published, is_published === '1' ? true : false)
            : undefined;

        const res = await this._drizzle.db().query.hotels.findMany({
        where: isPrivateCondition,
        limit,
        offset,
        });

        const total = await this._drizzle
        .db()
        .select({ value: count() })
        .from(hotels)
        .where(isPrivateCondition);

        return {
        data: res,
        total: total[0].value,
        };
    }
}