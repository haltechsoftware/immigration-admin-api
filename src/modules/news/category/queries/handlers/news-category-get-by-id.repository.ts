import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetNewsCategoryById } from "../impl/news-category-get-by-id";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { sql } from "drizzle-orm";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetNewsCategoryById)
export class GetCategoryByIdHandler implements IQueryHandler<GetNewsCategoryById> {
    constructor(private readonly drizzle: DrizzleService) { }
    private prepared = this.drizzle
        .db()
        .query.newsCategories.findFirst({
            where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
            with: {
                translates: true,
            },
        })
        .prepare('find_banner_by_id');

    async execute({ id }: GetNewsCategoryById): Promise<any> {
        const res = await this.prepared.execute({ id });

        if (!res) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

        return res;
    }

}