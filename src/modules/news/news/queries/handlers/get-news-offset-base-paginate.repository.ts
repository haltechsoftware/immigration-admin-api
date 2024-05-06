import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { news } from 'src/modules/news/entities';
import { GetNewsOffsetBasePaginateQuery } from '../impl/get-news-offset-base-paginate.query';

@QueryHandler(GetNewsOffsetBasePaginateQuery)
export class GetNewsOffsetBasePaginateHandler
  implements IQueryHandler<GetNewsOffsetBasePaginateQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    paginate: { limit, offset, category_id, status },
  }: GetNewsOffsetBasePaginateQuery): Promise<any> {
    const res = await this.drizzle.db().query.news.findMany({
      where: (f, o) =>
        o.and(
          category_id ? o.eq(f.category_id, category_id) : undefined,
          status ? o.eq(f.status, status) : undefined,
        ),
      limit,
      offset,
      with: {
        translates: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });
    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(news)
      .where(
        and(
          category_id ? eq(news.category_id, category_id) : undefined,
          status ? eq(news.status, status) : undefined,
        ),
      );

    return {
      data: res,
      total: total[0].value,
    };
  }
}
