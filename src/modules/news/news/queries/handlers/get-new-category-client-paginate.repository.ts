import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { newsCategories } from 'src/modules/news/entities';
import { GetNewsCategoryOffsetBasePaginateClientQuery } from '../impl/get-new-category-all.query';

@QueryHandler(GetNewsCategoryOffsetBasePaginateClientQuery)
export class GetNewCategoryOffsetBasePaginateClientQueryHandler
  implements IQueryHandler<GetNewsCategoryOffsetBasePaginateClientQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(newsCategories)
    .prepare();

  async execute({
    paginate: { lang, offset, limit },
  }: GetNewsCategoryOffsetBasePaginateClientQuery): Promise<any> {
    const res = await this._drizzle.db().query.newsCategories.findMany({
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
      data: res,
      total: total[0].value,
    };
  }
}
