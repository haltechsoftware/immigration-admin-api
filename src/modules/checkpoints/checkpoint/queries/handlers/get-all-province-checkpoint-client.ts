import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { provinceCountry } from 'src/modules/checkpoints/entities';
import { GetAllProvinceCheckpointCheckpointClientCommand } from '../impl/get-all-province-checkpoint-client';
import { NotFoundException } from '@nestjs/common';

// Enum type for country to avoid passing a generic string
type CountryEnum = 'vietnam' | 'thailand' | 'cambodia' | 'myanmar' | 'china' | 'airport';

@QueryHandler(GetAllProvinceCheckpointCheckpointClientCommand)
export class QueryGetAllProvinceCheckpointClientHandler implements IQueryHandler<any> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { country, limit, offset, lang },
  }: GetAllProvinceCheckpointCheckpointClientCommand): Promise<any> {
    // Ensure the country is valid
    const validCountries: CountryEnum[] = ['vietnam', 'thailand', 'cambodia', 'myanmar', 'china', 'airport'];
    if (country && !validCountries.includes(country as CountryEnum)) {
      throw new NotFoundException({
        message: `country ຕ້ອງຢູ່ໃນ ${validCountries.join(', ')}`,
      });
    }

    // Conditions for filtering
    const conditions = [];
    if (country) {
      conditions.push(eq(provinceCountry.country, country as CountryEnum));
    }
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch province-country relationships with translated province names
    const res = await this._drizzle.db().query.provinceCountry.findMany({
      with: {
        province: {
          with: {
            translates: {
              where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined,
            },
          },
        },
      },
      where: whereCondition,
      offset,
      limit,
    });

    // Get total count
    const total = await this._drizzle
      .db()
      .select({ value: count() })
      .from(provinceCountry)
      .where(whereCondition);

    return {
      data: res.map((province_country) => ({
        id: province_country.id,
        country: province_country.country,
        provinceId: province_country.provinceId,
        province: province_country.province
          ? {
              id: province_country.province.id,
              name: province_country.province.translates[0]?.name || null, // Get first translation
              slug: province_country.province.translates[0]?.slug || null,
              lang: province_country.province.translates[0]?.lang || null,
            }
          : null,
      })),
      total: total[0]?.value || 0,
    };
  }
}
