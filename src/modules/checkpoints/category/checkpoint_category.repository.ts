import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertCheckpointCategory, InsertCheckpointCategoryTranslate,  checkpointCategories,  checkpointCategoryTranslate,  countries, countryTranslate } from '../entities';

export type InsertCheckpointType = InsertCheckpointCategory & {
  translates: InsertCheckpointCategoryTranslate[];
};

export type UpdateCheckpointType = InsertCheckpointType

@Injectable()
export class CheckpointCategoryRepository {
  constructor(private readonly _drizzle: DrizzleService) { }

  async create(input: InsertCheckpointType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const checkPointCategories = await tx
        .insert(checkpointCategories)
        .values({})

      await tx.insert(checkpointCategoryTranslate).values(
        input.translates.map((val) => ({
          category_id: checkPointCategories[0].insertId,
          title: val.title,
          slug: val.slug,
          description: val.description,
          lang: val.lang,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.checkpointCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateCheckpointType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(checkpointCategories)
        .set({
          updated_at: input.updated_at,
        })
        .where(eq(checkpointCategories.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(checkpointCategoryTranslate)
          .set({
            category_id: val.category_id,
            title: val.title,
            slug: val.slug,
            description: val.description,
          })
          .where(eq(checkpointCategoryTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(checkpointCategories).where(eq(checkpointCategories.id, id));
  }
}
