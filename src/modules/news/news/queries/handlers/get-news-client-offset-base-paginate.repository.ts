import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetNewsOffsetBasePaginateClientQuery } from "../impl/get-new-offset-base-paginate-client.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { news } from "src/modules/news/entities";
import { sql } from "drizzle-orm";

@QueryHandler(GetNewsOffsetBasePaginateClientQuery)
export class GetNewsOffsetBasePaginateClientHandler
  implements IQueryHandler<GetNewsOffsetBasePaginateClientQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    paginate: { lang, limit, offset },
  }: GetNewsOffsetBasePaginateClientQuery): Promise<any> {
    const res = await this.drizzle.db().query.news.findMany({
      limit,
      offset,
      with: {
        translates: {
          where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined,
        },
      },
    });
    const total = await this.drizzle
      .db()
      .select({ value: sql<number>`COUNT(*)` })
      .from(news);

    return {
      data: res,
      total: total[0].value,
    };
  }
}