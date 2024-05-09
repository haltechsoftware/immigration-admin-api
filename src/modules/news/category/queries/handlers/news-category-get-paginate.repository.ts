import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { newsCategories } from 'src/modules/news/entities';
import { GetNewsCategoryOffsetBasePaginateQuery } from '../impl/news-category-get-paginate';

@QueryHandler(GetNewsCategoryOffsetBasePaginateQuery)
export class GetCategoryOffsetBasePaginateQueryHandler
  implements IQueryHandler<GetNewsCategoryOffsetBasePaginateQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(newsCategories)
    .prepare();

  async execute({
    paginate: { offset, limit },
  }: GetNewsCategoryOffsetBasePaginateQuery): Promise<any> {
    const res = await this._drizzle.db().query.newsCategories.findMany({
      with: { translates: true },
      offset,
      limit,
    });

    const total = await this._prepared.execute();

    return {
      data: res,
      total: total[0].value,
      limit,
      offset,
    };
  }
}
