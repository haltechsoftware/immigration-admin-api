import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { hotels } from 'src/modules/hotels/entities';
import { GetAllHotelQuery } from '../imp/get-all.query';

@QueryHandler(GetAllHotelQuery)
export class GetAllHotelQueryHandler
  implements IQueryHandler<GetAllHotelQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  async execute({
    input: { offset, limit, is_published },
  }: GetAllHotelQuery): Promise<any> {
    const isPrivateCondition = is_published
      ? eq(hotels.is_published, is_published === '1' ? true : false)
      : undefined;

    const res = await this._drizzle.db().query.hotels.findMany({
      with: {
        translates: {
          columns: {
            id: true,
            lang: true,
            name: true,
          },
        },
      },
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
