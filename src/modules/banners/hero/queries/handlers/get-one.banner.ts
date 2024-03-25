import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOneBannerQuery } from "../impl/get-one.banner";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { sql } from 'drizzle-orm';
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetOneBannerQuery)
export class GetOneBannerQueryHandler implements IQueryHandler<GetOneBannerQuery> {
    constructor(private readonly drizzle: DrizzleService) { }
    private prepared = this.drizzle
        .db()
        .query.banners.findFirst({
            columns: { is_private: false },
            where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
            with: {
                translates: true,
            },
        })
        .prepare('find_banner_by_id');

    async execute({id}: GetOneBannerQuery): Promise<any> {
        const res = await this.prepared.execute({ id });

        if (!res) throw new NotFoundException('banner is empty');
        return res

    }

}