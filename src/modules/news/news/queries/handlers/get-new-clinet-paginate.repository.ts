import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { news } from "src/modules/news/entities";
import { and, eq, sql } from "drizzle-orm";
import { GetNewsClientOffsetBasePaginateQuery } from "../impl/get-new-to-client.query";

@QueryHandler(GetNewsClientOffsetBasePaginateQuery)
export class GetNewsClientOffsetBasePaginateHandler
  implements IQueryHandler<GetNewsClientOffsetBasePaginateQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    paginate: { slug, lang, limit, offset },
  }: GetNewsClientOffsetBasePaginateQuery): Promise<any> {
    
    // 1. Get category
    const newsCategory = await this.drizzle.db().query.newsCategoriesTranslate.findFirst({
      where: (f, o) => o.eq(f.slug, slug),
      columns: {
        category_id: true,
      },
    });
    console.log(newsCategory);

    // 2. Prepare where conditions
    const conditions = [
      newsCategory ? eq(news.category_id, newsCategory.category_id!) : undefined,
      eq(news.status, 'published'),
    ].filter(Boolean);

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // 3. Fetch paginated news
    const res = await this.drizzle.db().query.news.findMany({
      limit,
      offset,
      where: whereClause,
      with: {
        translates: {
          where: lang
            ? (f, o) => o.eq(f.lang, lang)
            : undefined,
        },
      },
    });

    // 4. Count total matching
    const total = await this.drizzle.db()
      .select({ value: sql<number>`COUNT(*)` })
      .from(news)
      .where(whereClause);

    // 5. Return result
    return {
      data: res,
      total: total[0].value,
    };
  }
}
