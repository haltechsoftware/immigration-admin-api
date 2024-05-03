import { Injectable } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import { InsertNews, InsertNewsTranslate, news, newsTranslate } from "../entities";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";

export type InsertNewsType = InsertNews & {
    translates: InsertNewsTranslate[];
};
export type UpdateNewsType = InsertNewsType

@Injectable()
export class NewsRepository {
    constructor(
        private readonly _drizzle: DrizzleService
    ) { }

    //create new categories
    async create(data: InsertNewsType) {
        await this._drizzle.db().transaction(async (tx) => {
            const newsInsert = await tx
                .insert(news)
                .values({
                    category_id: data.category_id,
                    thumbnail: data.thumbnail,
                    status: data.status,
                    public_at: data.public_at,
                })
                .returning();

            await tx.insert(newsTranslate).values(
                data.translates.map((val) => ({
                    news_id: newsInsert[0].id,
                    title: val.title,
                    description: val.description,
                    slug: val.slug,
                    content: val.content,
                    lang: val.lang,
                })),
            );
        });
    }
    //get by id
    private _getByIdPrepared = this._drizzle
        .db()
        .query.news.findFirst({
            where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
            with: {
                translates: true
            },
        })
        .prepare('get_by_id');
    async findOne(
        id: number,
    ) {
        const res = await this._getByIdPrepared.execute({ id })
        return res
    }

    //upate new categories
    async update(data: UpdateNewsType): Promise<void> {

        await this._drizzle.db().transaction(async (tx) => {
            await tx
                .update(news)
                .set({ 
                    thumbnail: data.thumbnail,
                    status: data.status,
                    public_at: data.public_at,
                    updated_at: data.updated_at
                 })
                .where(eq(news.id, data.id));

            data.translates.forEach(async (val) => {
                await tx
                    .update(newsTranslate)
                    .set({
                        title: val.title,
                        description: val.description,
                        slug: val.slug,
                        content: val.content,
                    })
                    .where(eq(newsTranslate.id, val.id));
            });
        });
    }
    //remove new categories
    async remove(id: number): Promise<any> {
        await this._drizzle.db().delete(news).where(eq(news.id, id));
    }
}