import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertProvinces,
  InsertTranslateProvinces,
  countriesToProvinces,
  provinceTranslate,
  provinces,
} from '../entities';

export type InsertProvinceType = InsertProvinces & {
  translates: InsertTranslateProvinces[];
  countryIds: number[];
};

export type UpdateProvinceType = InsertProvinceType;

@Injectable()
export class ProvinceRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertProvinceType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const res = await tx.insert(provinces).values({});

      await tx.insert(provinceTranslate).values(
        input.translates.map((val) => ({
          province_id: res[0].insertId,
          name: val.name,
          slug: val.slug,
          lang: val.lang,
        })),
      );

      if (input.countryIds.length > 0)
        await tx.insert(countriesToProvinces).values(
          input.countryIds.map((val) => ({
            country_id: val,
            province_id: res[0].insertId,
          })),
        );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.provinces.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateProvinceType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(provinces)
        .set({
          updated_at: input.updated_at,
        })
        .where(eq(provinces.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(provinceTranslate)
          .set({
            province_id: val.province_id,
            name: val.name,
            slug: val.slug,
          })
          .where(eq(provinceTranslate.id, val.id));
      });

      if (input.countryIds.length > 0) {
        await tx
          .delete(countriesToProvinces)
          .where(eq(countriesToProvinces.province_id, input.id));

        await tx.insert(countriesToProvinces).values(
          input.countryIds.map((val) => ({
            country_id: val,
            province_id: input.id,
          })),
        );
      }
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(provinces).where(eq(provinces.id, id));
  }
}
