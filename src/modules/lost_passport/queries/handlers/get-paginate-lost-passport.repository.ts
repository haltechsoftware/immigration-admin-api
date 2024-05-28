import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { IPaginated } from 'src/common/interface/pagination/paginated.interface';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { lostPassport } from '../../entities';
import { GetPaginateLostPassportQuery } from '../impl/get-paginate-lost-passport';

@QueryHandler(GetPaginateLostPassportQuery)
export class GetPaginateLostPassportHandler
  implements IQueryHandler<GetPaginateLostPassportQuery, IPaginated<any>>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(lostPassport)
    .prepare();

  async execute({
    paginate: { cursor, limit, lang },
  }: GetPaginateLostPassportQuery): Promise<any> {
    const res = await this._drizzle.db().query.lostPassport.findMany({
      with: {
        translates: {
          columns: { id: true, title: true },
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
      },
      orderBy: (fields, operators) => operators.asc(fields.created_at),
      where: (fields, operators) =>
        cursor ? operators.gt(fields.created_at, cursor) : undefined,
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
