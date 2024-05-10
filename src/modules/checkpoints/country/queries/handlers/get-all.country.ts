import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { and, count, eq } from "drizzle-orm/sql";
import { countries } from "src/modules/checkpoints/entities";
import { GetAllCountryCommand } from "../impl/get-all.country";

@QueryHandler(GetAllCountryCommand)
export class QueryGetAllCountryHandler implements IQueryHandler<any> {

  constructor(private readonly _drizzle: DrizzleService) { }
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(countries)
    .prepare();
  async execute({ query: { lang, is_except_visa }, paginated: { limit, offset } }: GetAllCountryCommand): Promise<any> {
    const isExceptVisaCondition =
      is_except_visa !== undefined
        ? eq(countries.is_except_visa, is_except_visa === '1' ? true : false)
        : undefined;
    const conditional = and(isExceptVisaCondition);

    const res = await this._drizzle.db().query.countries.findMany({
      where: conditional,
      with: {
        translates: {
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
        provinces: {
          with: {
            province: {
              with: {
                translates: {
                  where: lang
                    ? (fields, operators) => operators.eq(fields.lang, lang) : undefined,
                }
              }
            }
          }

        }
      },
      limit, offset,
      orderBy: (fields, operators) => operators.asc(fields.created_at),
    });

    const total = await this._prepared.execute();

    return {
      data: res,
      count: total[0].value,
      limit, offset,
    };
  }
}
