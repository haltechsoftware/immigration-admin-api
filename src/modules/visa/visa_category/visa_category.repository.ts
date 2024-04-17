import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertVisaCategory,
  InsertVisaCategoryTranslate,
  visaCategories,
  visaCategoryTranslate,
} from '../entities';

export type InsertVisaCategoryType = InsertVisaCategory & {
  translates: InsertVisaCategoryTranslate[];
};

export type UpdateVisaCategoryType = InsertVisaCategoryType;

@Injectable()
export class VisaCategoryRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertVisaCategoryType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const visa_category = await tx
        .insert(visaCategories)
        .values({})
        .returning();

      await tx.insert(visaCategoryTranslate).values(
        input.translates.map((val) => ({
          visa_category_id: visa_category[0].id,
          name: val.name,
          content: val.content,
          lang: val.lang,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.visaCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare('find_visa_category_by_id');
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateVisaCategoryType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(visaCategories)
        .set({
          updated_at: input.updated_at,
        })
        .where(eq(visaCategories.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(visaCategoryTranslate)
          .set({
            name: val.name,
            content: val.content,
          })
          .where(eq(visaCategoryTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle
      .db()
      .delete(visaCategories)
      .where(eq(visaCategories.id, id));
  }
}
