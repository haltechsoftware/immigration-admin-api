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
    paginate: { category_id, lang, limit, offset },
  }: GetNewsClientOffsetBasePaginateQuery): Promise<any> {
    const res = await this.drizzle.db().query.news.findMany({
      limit,
      offset,
    //   where: category_id
    //     ? (f, o) => o.eq(f.category_id, category_id)
    //     : undefined,
        where: and(
            category_id ? eq(news.category_id, category_id) : undefined,
            eq(news.status, 'published'),
        ),
    
      with: {
        translates: {
          where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined,
        },
      },
    });
    const total = await this.drizzle
      .db()
      .select({ value: sql<number>`COUNT(*)` })
      .from(news)
      .where(and(
        category_id ? eq(news.category_id, category_id) : undefined,
        eq(news.status, 'published'),
      ));

    return {
      data: res,
      total: total[0].value,
    };
  }
}