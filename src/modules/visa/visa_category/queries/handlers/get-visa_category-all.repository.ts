import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import GetVisaCategoryQuery from "../impl/get-visa_category-all.query";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { count } from "drizzle-orm";
import { visaCategories } from "src/modules/visa/entities";


@QueryHandler(GetVisaCategoryQuery)
export class GetVisaCategoryHandler implements IQueryHandler<GetVisaCategoryQuery> {
  constructor(private readonly _drizzle: DrizzleService) {}

  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(visaCategories)
    .prepare('count_visa_category');

  async execute({ paginate: { offset, limit } }: GetVisaCategoryQuery) {
    const res = await this._drizzle.db().query.visaCategories.findMany({
      with: {
        translates: true,
      },
      limit,
      offset,
    });
    const total = await this._prepared.execute();

    return {
      data: res,
      total: total[0].value,
    };
  }
}