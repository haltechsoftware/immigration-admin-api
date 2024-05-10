import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { count } from "drizzle-orm/sql";
import { countries } from "src/modules/checkpoints/entities";
import { GetAllCheckpointCategoryCommand } from "../impl/get-all";

@QueryHandler(GetAllCheckpointCategoryCommand)
export class QueryGetAllCheckpointCategoryHandler implements IQueryHandler<any> {

  constructor(private readonly _drizzle: DrizzleService) { }
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(countries)
    .prepare();
  async execute({ query: { lang }, paginated: { limit, offset } }: GetAllCheckpointCategoryCommand): Promise<any> {
    const res = await this._drizzle.db().query.checkpointCategories.findMany({
      with: {
        translates: {
          where: lang
            ? (fields, operators) => operators.eq(fields.lang, lang)
            : undefined,
        },
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
