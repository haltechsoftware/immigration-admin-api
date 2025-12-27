import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertNationality, nationality } from './entities/nationality';
import { InsertNationalityTranslate, nationalityTranslate } from './entities';
import { eq, sql } from 'drizzle-orm';

export type InsertNationalityType = InsertNationality & {
  translates: InsertNationalityTranslate[];
};

export type UpdateNationalityType = InsertNationalityType;

@Injectable()
export class NationalityRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertNationalityType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const nationalities = await tx.insert(nationality).values({});

      await tx.insert(nationalityTranslate).values(
        input.translates.map((val) => ({
          nationality_id: nationalities[0].insertId,
          name: val.name,
          lang: val.lang,
        })),
      );
    });
  }

  private _getByIdPrepared = this._drizzle
    .db()
    .query.nationality.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this._getByIdPrepared.execute({ id });
  }

  async update(data: UpdateNationalityType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(nationality)
        .set({ updated_at: data.updated_at })
        .where(eq(nationality.id, data.id));

      data.translates.forEach(async (val) => {
        await tx
          .update(nationalityTranslate)
          .set({
            name: val.name,
          })
          .where(eq(nationalityTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(nationality).where(eq(nationality.id, id));
  }
}
