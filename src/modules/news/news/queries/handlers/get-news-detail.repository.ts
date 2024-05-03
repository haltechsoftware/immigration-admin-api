import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { sql } from "drizzle-orm";
import { NotFoundException } from "@nestjs/common";
import { GetNewsDetailQuery } from "../impl/get-news-detail.query";

@QueryHandler(GetNewsDetailQuery)
export class GetNewsDetailHandler implements IQueryHandler<GetNewsDetailQuery> {
    constructor(private readonly drizzle: DrizzleService) { }
    private prepared = this.drizzle
        .db()
        .query.news.findFirst({
            where: (fields, { eq ,}) => eq(fields.id, sql.placeholder('id')),
            with: {
                translates: true,
                category: { with: { translates: true } }
            },
        })
        .prepare('find_banner_by_id');

    async execute({ id }: GetNewsDetailQuery): Promise<any> {
        const res = await this.prepared.execute({ id });

        if (!res || res.public_at === null) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

        return res;
    }

}