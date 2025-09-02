import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertCountries,
  InsertCountriesTranslate,
  countries,
  countryTranslate,
} from '../entities';

export type InsertCountryType = InsertCountries & {
  translates: InsertCountriesTranslate[];
};

export type UpdateCountryType = InsertCountryType;

@Injectable()
export class CountryRepository {
  constructor(private readonly _drizzle: DrizzleService) {}

  async create(input: InsertCountryType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      const res = await tx
        .insert(countries)
        .values({ image: input.image, is_except_visa: input.is_except_visa });

      await tx.insert(countryTranslate).values(
        input.translates.map((val) => ({
          country_id: res[0].insertId,
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

  private preparedFindCountryId = this._drizzle
    .db()
    .query.arrivalRegistration.findFirst({
      where: (fields, { eq, sql }) =>
        eq(fields.country_id, sql.placeholder('country_id')),
    })
    .prepare();

  async findCountryId(id: number) {
    return await this.preparedFindCountryId.execute({ country_id: id });
  }

  async findOneCountry(id: number) {
    const result = await this._drizzle
      .db()
      .select()
      .from(countries)
      .where(eq(countries.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async update(input: UpdateCountryType): Promise<void> {
    await this._drizzle.db().transaction(async (tx) => {
      await tx
        .update(countries)
        .set({
          image: input.image,
          is_except_visa: input.is_except_visa,
          updated_at: input.updated_at,
        })
        .where(eq(countries.id, input.id));

      input.translates.forEach(async (val) => {
        await tx
          .update(countryTranslate)
          .set({
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
