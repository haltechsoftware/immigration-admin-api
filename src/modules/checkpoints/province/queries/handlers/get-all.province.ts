import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { GetAllProvinceCommand } from "../impl/get-all.province";
import { count } from "drizzle-orm/sql";
import { provinces } from "src/modules/checkpoints/entities";

@QueryHandler(GetAllProvinceCommand)
export class QueryGetAllProvinceHandler implements IQueryHandler<any> {

    constructor(private readonly _drizzle: DrizzleService) { }
    private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(provinces)
    .prepare();
    async execute({query: {lang}}): Promise<any> {
        const res = await this._drizzle.db().query.provinces.findMany({
            with: {
              translates: {
                where: lang
                  ? (fields, operators) => operators.eq(fields.lang, lang)
                  : undefined,
              },
            },
            orderBy: (fields, operators) => operators.asc(fields.created_at),
          });
      
          const total = await this._prepared.execute();
      
          return {
            data: res,
            count: total[0].value
          };
    }
}
