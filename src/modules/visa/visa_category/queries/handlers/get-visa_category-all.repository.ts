import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { visaCategories } from 'src/modules/visa/entities';
import GetVisaCategoryQuery from '../impl/get-visa_category-all.query';

@QueryHandler(GetVisaCategoryQuery)
export class GetVisaCategoryHandler
  implements IQueryHandler<GetVisaCategoryQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(visaCategories)
    .prepare('count_visa_category');

  async execute({ paginate: { cursor, limit, lang } }: GetVisaCategoryQuery) {
    const res = await this._drizzle.db().query.visaCategories.findMany({
      with: {
        translates: {
          columns: { id: true, name: true },
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
        name: val.translates[0].name,
        translates: undefined,
      })),
      total: total[0].value,
    };
  }
}
