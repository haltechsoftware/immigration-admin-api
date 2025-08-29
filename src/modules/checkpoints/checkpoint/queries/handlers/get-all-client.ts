import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { checkpoints } from 'src/modules/checkpoints/entities';
import { GetAllCheckpointClientCommand } from '../impl/get-all-client';
import { NotFoundException } from '@nestjs/common';

// Enum type for country to avoid passing a generic string
type CountryEnum =
  | 'vietnam'
  | 'thailand'
  | 'cambodia'
  | 'myanmar'
  | 'china'
  | 'airport';

@QueryHandler(GetAllCheckpointClientCommand)
export class QueryGetAllCheckpointClientHandler implements IQueryHandler<any> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { province_id, country, limit, offset, lang },
  }: GetAllCheckpointClientCommand): Promise<any> {
    // Convert province_id to number if it's not "all"
    const provinceIdNumber =
      province_id && province_id !== 'all' ? Number(province_id) : null;

    // Ensure that the country is one of the allowed enum values
    const validCountries: CountryEnum[] = [
      'vietnam',
      'thailand',
      'cambodia',
      'myanmar',
      'china',
      'airport',
    ];
    if (country && !validCountries.includes(country as CountryEnum)) {
      throw new NotFoundException({
        message: `country ຕ້ອງຢູ່ໃນ ${validCountries.join(', ')}`,
      });
    }

    // Collect valid conditions dynamically
    const conditions = [];
    if (country) {
      conditions.push(eq(checkpoints.country, country as CountryEnum));
    }

    // Apply province_id filtering only if it's not 'all'
    if (provinceIdNumber !== null) {
      conditions.push(eq(checkpoints.province_id, provinceIdNumber));
    }

    // If no conditions, return all records
    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Fetching checkpoints with optional filtering
    const res = await this._drizzle.db().query.checkpoints.findMany({
      with: {
        translates: {
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
      },
      where: whereCondition, // Apply the dynamic condition
      offset,
      limit,
    });

    // Getting the total count with the same conditions
    const total = await this._drizzle
      .db()
      .select({ value: count() })
      .from(checkpoints)
      .where(whereCondition);

    return {
      data: res,
      total: total[0]?.value || 0, // Use a fallback if no total is found
    };
  }
}
