import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetCountryClientQuery from '../impl/get-country.query';

@QueryHandler(GetCountryClientQuery)
export class queryCountriesClientHandler
  implements IQueryHandler<GetCountryClientQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { lang, limit, offset },
  }: GetCountryClientQuery): Promise<any> {
    const countryList = await this._drizzle.db().query.countries.findMany({
      with: {
        translates: {
          columns: {
            name: true,
            slug: true,
          },
          where: lang ? (f, o) => o.eq(f.lang, lang) : undefined,
        },
      },
      offset,
      limit,
    });

    const result = countryList.map((country) => ({
      id: country.id,
      name: country.translates?.[0]?.name ?? null,
      slug: country.translates?.[0]?.slug ?? null,
    }));

    return {
      data: result,
    };
  }
}
