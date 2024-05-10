import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { countries } from 'src/modules/checkpoints/entities';
import { GetAllCountryCommand } from '../impl/get-all.country';

@QueryHandler(GetAllCountryCommand)
export class QueryGetAllCountryHandler implements IQueryHandler<any> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { is_except_visa, limit, offset },
  }: GetAllCountryCommand): Promise<any> {
    const conditional = and(
      is_except_visa
        ? eq(countries.is_except_visa, is_except_visa === '1' ? true : false)
        : undefined,
    );

    const res = await this._drizzle.db().query.countries.findMany({
      where: conditional,
      with: {
        translates: true,
      },
      limit,
      offset,
    });

    const total = await this._drizzle
      .db()
      .select({ value: count() })
      .from(countries)
      .where(conditional);

    return {
      data: res,
      count: total[0].value,
    };
  }
}
