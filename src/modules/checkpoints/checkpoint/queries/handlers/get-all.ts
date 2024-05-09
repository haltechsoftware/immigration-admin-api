import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { count } from "drizzle-orm/sql";
import { checkpoints, countries } from "src/modules/checkpoints/entities";
import { GetAllCheckpointCommand } from "../impl/get-all";

@QueryHandler(GetAllCheckpointCommand)
export class QueryGetAllCheckpointHandler implements IQueryHandler<any> {

  constructor(private readonly _drizzle: DrizzleService) { }
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(checkpoints)
    .prepare();
  async execute({ query: { lang }, paginated: { limit, offset } }: GetAllCheckpointCommand): Promise<any> {
    const res = await this._drizzle.db().query.checkpoints.findMany({
      columns: { category_id: false, province_id: false, country_id: false },
      with: {
        translates: {
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
        category: {
          with: {
            translates: { where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined }
          }
        },
        province: {
          with: {
            translates: { where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined }
          }
        },
        country: {
          with: {
            provinces: {
              columns: { country_id: false, province_id: false },
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

            },
            translates: { where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined }
          }
        }, 
      },
      offset, limit,
      orderBy: (fields, operators) => operators.asc(fields.created_at),
    });

    const total = await this._prepared.execute();

    return {
      data: res,
      count: total[0].value,
      limit,
      offset
    };
  }
}
