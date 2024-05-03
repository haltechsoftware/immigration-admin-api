import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetNewsOffsetBasePaginateQuery } from "../impl/get-news-offset-base-paginate.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { news } from "src/modules/news/entities";
import { count, isNotNull } from "drizzle-orm";

@QueryHandler(GetNewsOffsetBasePaginateQuery)
export class GetNewsOffsetBasePaginateHandler implements IQueryHandler<GetNewsOffsetBasePaginateQuery> {
    constructor(private readonly drizzle: DrizzleService) { }

    private _getCount = this.drizzle
        .db()
        .select({ value: count() })
        .from(news)
        .where(isNotNull(news.public_at))
        .prepare('count_news');
    async execute({ paginate: { limit, offset } }: GetNewsOffsetBasePaginateQuery): Promise<any> {
        const res = await this.drizzle.db().query.news.findMany({
            limit,
            offset,
            where: isNotNull(news.public_at),
            with: {
                translates: true,
                category: {
                    with: { translates: true },
                }
            },
        });
        const total = await this._getCount.execute();

        return {
            data: res,
            total: total[0].value,
        };
    }
}