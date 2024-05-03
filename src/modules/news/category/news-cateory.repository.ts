import { Injectable } from "@nestjs/common";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { InsertNewsCategories, InsertNewsCategoriesTranslate, newsCategories, newsCategoriesTranslate } from "../entities";
import { eq, sql } from "drizzle-orm";

export type InsertNewsCategoryType = InsertNewsCategories & {
    translates: InsertNewsCategoriesTranslate[];
};
export type UpdateNewsCategoryType = InsertNewsCategoryType

@Injectable()
export class NewsCategoryRepository {
    constructor(
        private readonly _drizzle: DrizzleService
    ) { }

    //create new categories
    async create(data: InsertNewsCategoryType) {
        await this._drizzle.db().transaction(async (tx) => {
            const newsCategoy = await tx
                .insert(newsCategories)
                .values({})
                .returning();

            await tx.insert(newsCategoriesTranslate).values(
                data.translates.map((val) => ({
                    category_id: newsCategoy[0].id,
                    lang: val.lang,
                    name: val.name,
                    slug: val.slug,
                })),
            );
        });
    }
    //get by id
    private _getByIdPrepared = this._drizzle
        .db()
        .query.newsCategories.findFirst({
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
    async update(data: UpdateNewsCategoryType): Promise<void> {
        
        await this._drizzle.db().transaction(async (tx) => {
            await tx
            .update(newsCategories)
            .set({ created_at: data.created_at })
            .where(eq(newsCategories.id, data.id));
            
            data.translates.forEach(async (val) => {
                await tx
                    .update(newsCategoriesTranslate)
                    .set({
                        name: val.name,
                        slug: val.slug,
                    })
                    .where(eq(newsCategoriesTranslate.id, val.id));
            });
        });
    }
    //remove new categories
    async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(newsCategories).where(eq(newsCategories.id, id));
  }
}