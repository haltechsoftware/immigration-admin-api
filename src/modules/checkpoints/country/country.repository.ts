import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertCountries, InsertCountriesTranslate, InsertTranslateProvinces, countries, countriesToProvinces, countryTranslate, provinceTranslate, provinces } from '../entities';

export type InsertCountryType = InsertCountries & {
  translates: InsertCountriesTranslate[];
};

export type UpdateCountryType = InsertCountryType

@Injectable()
export class CountryRepository {
  constructor(private readonly _drizzle: DrizzleService) { }

  async create(input: InsertCountryType, provinceIds: number[]): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const Countries = await tx
        .insert(countries)
        .values({ image: input.image, is_except_visa: input.is_except_visa })

      if (provinceIds.length > 0) {
        await tx.insert(countriesToProvinces).values(
          provinceIds.map((id) => ({
            country_id: Countries[0].insertId,
            province_id: id,
          })),
        );
      }
      await tx.insert(countryTranslate).values(
        input.translates.map((val) => ({
          country_id: Countries[0].insertId,
          name: val.name,
          slug: val.slug,
          description: val.description,
          lang: val.lang,
        })),
      );
    });
  }

  private prepared = this._drizzle
    .db()
    .query.countries.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();
  async findOne(id: number) {
    return await this.prepared.execute({ id });
  }

  async update(input: UpdateCountryType, provincesIds: number[]): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(countries)
        .set({
          image: input.image,
          is_except_visa: input.is_except_visa,
          updated_at: input.updated_at,
        })
        .where(eq(countries.id, input.id));
      //update countries to provinces
      if (provincesIds.length > 0) {
        await tx
          .delete(countriesToProvinces)
          .where(eq(countriesToProvinces.country_id, input.id));

        await tx.insert(countriesToProvinces).values(
          provincesIds.map((id) => ({
            country_id: input.id,
            province_id: id,
          })),
        );
      }

      input.translates.forEach(async (val) => {
        await tx
          .update(countryTranslate)
          .set({
            country_id: val.country_id,
            name: val.name,
            slug: val.slug,
            description: val.description,
          })
          .where(eq(countryTranslate.id, val.id));
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this._drizzle.db().delete(countries).where(eq(countries.id, id));
  }
}
