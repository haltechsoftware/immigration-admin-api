import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertProvinces,
  InsertTranslateProvinces,
  provinceTranslate,
  provinces,
} from '../entities';
import { provinceCountry } from '../entities/province_country';

export type InsertProvinceType = InsertProvinces & {
  translates: InsertTranslateProvinces[];
  countries: string[];
};

export type UpdateProvinceType = InsertProvinceType;

@Injectable()
export class ProvinceRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertProvinceType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const res = await tx.insert(provinces).values({});

      if (input.countries.length > 0)
        await tx.insert(provinceCountry).values(
          input.countries.map((_) => ({
            country: _ as any,
            provinceId: res[0].insertId,
          })),
        );

      await tx.insert(provinceTranslate).values(
        input.translates.map((val) => ({
          province_id: res[0].insertId,
          name: val.name,
          slug: val.slug,
          lang: val.lang,
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

      if (input.countries.length > 0) {
        await tx
          .delete(provinceCountry)
          .where(eq(provinceCountry.provinceId, input.id));

        await tx.insert(provinceCountry).values(
          input.countries.map((_) => ({
            country: _ as any,
            provinceId: input.id,
          })),
        );
      }

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
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(provinces).where(eq(provinces.id, id));
  }
}
