import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetNationalityQuery from '../impl/get-all.query';
import { nationality } from '../../entities';

@QueryHandler(GetNationalityQuery)
export class GetNationalityHandler
  implements IQueryHandler<GetNationalityQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(nationality)
    .prepare();

  async execute({ paginate: { offset, limit, lang } }: GetNationalityQuery) {
    const res = await this._drizzle.db().query.nationality.findMany({
      with: {
        translates: {
          where: lang ? (f, o) => o.eq(f.lang, lang) : undefined,
        },
      },
      offset,
      limit,
    });
    const total = await this._prepared.execute();

    return {
      data: res.map((val) => ({
        ...val,
        lang_id: val.translates[0].id,
        name: val.translates[0].name,
        lang: val.translates[0].lang,
        translates: undefined,
      })),
      total: total[0].value,
    };
  }
}
