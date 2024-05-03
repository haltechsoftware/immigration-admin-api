import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertNewsCategories,
  InsertNewsCategoriesTranslate,
  newsCategories,
  newsCategoriesTranslate,
} from '../entities';

export type InsertNewsCategoryType = InsertNewsCategories & {
  translates: InsertNewsCategoriesTranslate[];
};
export type UpdateNewsCategoryType = InsertNewsCategoryType;

@Injectable()
export class NewsCategoryRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(data: InsertNewsCategoryType) {
    await this._drizzle.db().transaction(async (tx) => {
      const newsCategory = await tx.insert(newsCategories).values({});

      await tx.insert(newsCategoriesTranslate).values(
        data.translates.map((val) => ({
          category_id: newsCategory[0].insertId,
          lang: val.lang,
          name: val.name,
          slug: val.slug,
        })),
      );
    });
  }

  private _getByIdPrepared = this._drizzle
    .db()
    .query.newsCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this._getByIdPrepared.execute({ id });
  }

  async update(data: UpdateNewsCategoryType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(newsCategories)
        .set({ updated_at: data.updated_at })
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

  async remove(id: number): Promise<any> {
    await this._drizzle
      .db()
      .delete(newsCategories)
      .where(eq(newsCategories.id, id));
  }
}
