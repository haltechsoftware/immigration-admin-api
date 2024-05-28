import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertLostPassport,
  InsertLostPassportTranslate,
  lostPassport,
  lostPassportTranslate,
} from './entities';

export type InsertLostPassportType = InsertLostPassport & {
  translates: InsertLostPassportTranslate[];
};

export type UpdateLostPassport = InsertLostPassportType;

@Injectable()
export class LostPassportRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(data: InsertLostPassportType) {
    await this._drizzle.db().transaction(async (tx) => {
      const res = await tx.insert(lostPassport).values({});

      await tx.insert(lostPassportTranslate).values(
        data.translates.map((val) => ({
          lost_passport_id: res[0].insertId,
          lang: val.lang,
          title: val.title,
          content: val.content,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.lostPassport.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateLostPassport): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(lostPassport)
        .set({
          updated_at: input.updated_at,
        })
        .where(eq(lostPassport.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(lostPassportTranslate)
          .set({
            title: val.title,
            content: val.content,
          })
          .where(eq(lostPassportTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle
      .db()
      .delete(lostPassport)
      .where(eq(lostPassport.id, id));
  }
}
