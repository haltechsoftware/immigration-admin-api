import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { provinces } from 'src/modules/checkpoints/entities';
import { GetAllProvinceCommand } from '../impl/get-all.province';

@QueryHandler(GetAllProvinceCommand)
export class QueryGetAllProvinceHandler
  implements IQueryHandler<GetAllProvinceCommand>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(provinces)
    .prepare();

  async execute({
    query: { limit, offset },
  }: GetAllProvinceCommand): Promise<any> {
    const res = await this._drizzle.db().query.provinces.findMany({
      with: {
        translates: {
          columns: {
            province_id: false,
          },
        },
      },
      limit,
      offset,
    });

    const total = await this._prepared.execute();

    return {
      data: res,
      count: total[0].value,
    };
  }
}
