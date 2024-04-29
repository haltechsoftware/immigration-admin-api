import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { GetAllProvinceCommand } from "../impl/get-all.province";
import { SQL, SQLWrapper, and, count, eq, ilike } from "drizzle-orm";
import { provinceTranslate, provinces } from "src/modules/checkpoints/entities";
import { QueryProvinceDto, QueryProvinceDtoType } from "../../dtos/query.province.dto";

@QueryHandler(GetAllProvinceCommand)
export class QueryGetAllProvinceHandler implements IQueryHandler<any> {

    constructor(private readonly _drizzle: DrizzleService) { }
    async execute({query: {lang}}): Promise<any> {
        const res = await this._drizzle.db().query.provinces.findMany({
            with: {
              translates: {
                columns: { id: true, name: true },
                where: lang
                  ? (fields, operators) => operators.eq(fields.lang, lang)
                  : undefined,
              },
            },
            orderBy: (fields, operators) => operators.asc(fields.created_at),
          });
      
        //   const total = await this._prepared.execute();
      
          return {
            data: res
          };
    }
}
