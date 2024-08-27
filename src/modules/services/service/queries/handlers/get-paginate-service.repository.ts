import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { IPaginated } from 'src/common/interface/pagination/paginated.interface';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { services } from '../../../entities';
import { GetPaginateServiceQuery } from '../impl/get-paginate-service';

@QueryHandler(GetPaginateServiceQuery)
export class GetPaginateServiceHandler
  implements IQueryHandler<GetPaginateServiceQuery, IPaginated<any>>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(services)
    .prepare();

  async execute({
    paginate: { offset, limit, lang },
  }: GetPaginateServiceQuery) {
    const res = await this._drizzle.db().query.services.findMany({
      with: {
        translates: {
          columns: { id: true, title: true },
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
      },
      orderBy: (fields, operators) => operators.asc(fields.created_at),
      offset,
      limit,
    });

    const total = await this._prepared.execute();

    return {
      data: res.map((val) => ({
        ...val,
        lang_id: val.translates[0].id,
        title: val.translates[0].title,
        translates: undefined,
      })),
      total: total[0].value,
    };
  }
}
