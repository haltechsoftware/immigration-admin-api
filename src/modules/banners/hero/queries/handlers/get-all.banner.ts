import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllBannerQuery } from "../impl/get-all.banner";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { banners } from "src/modules/banners/entities";
import { count, eq, sql } from "drizzle-orm";

@QueryHandler(GetAllBannerQuery)
export class GetAllBannerQueryHandler implements IQueryHandler<GetAllBannerQuery> {
    constructor(private readonly _drizzle: DrizzleService) { }

    private _prepared = this._drizzle
        .db()
        .select({ value: count() })
        .from(banners)
        .where(eq(banners.is_private, false))
        .prepare('count_banners');

    async execute({ input, paginate: { offset, limit } }: GetAllBannerQuery): Promise<any> {
        const { startTime, endTime } = input;
        const start_time = new Date(startTime);
        const end_time = new Date(endTime);

        //**** */ Use requested language if available, otherwise use default
        const defaultLang = 'lo';
        const requestedLang = input.lang || defaultLang;

        if (startTime && endTime) {
            // Convert Date objects to ISO string format
            const startTimeISO = start_time.toISOString();
            const endTimeISO = end_time.toISOString();


            let queryBuilder = this._drizzle.db().query.banners.findMany({
                where: sql`${banners.is_private} = ${false} AND Date(${banners.start_time}) >= ${startTimeISO} AND Date(${banners.start_time}) <= ${endTimeISO}`,
                with: { translates: true },
                limit,
                offset,
            });
            const res = await queryBuilder;
            const total = await this._prepared.execute();
            const filteredRes = res.map(item => ({
                ...item,
                translates: item.translates.filter(translate => translate.lang === requestedLang)
            }));
            return {
                data: filteredRes,
                total: total[0].value,
            };
        }
        //*** */
        let queryBuilder = this._drizzle.db().query.banners.findMany({
            where: (fields, { eq }) => eq(fields.is_private, false),
            with: {
                translates: true,
            },
            limit,
            offset,
        });


        const res = await queryBuilder;
        const total = await this._prepared.execute();
        const filteredRes = res.map(item => ({
            ...item,
            translates: item.translates.filter(translate => translate.lang === requestedLang)
        }));

        return {
            data: filteredRes,
            total: total[0].value,
        };

    }
}