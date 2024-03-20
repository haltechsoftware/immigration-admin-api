import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetPopupQuery from "../impl/get-popup.query";



@QueryHandler(GetPopupQuery)
export class GetPopupHandler implements IQueryHandler<GetPopupQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ paginate: { offset, limit } }: GetPopupQuery) {
    const res = await this.drizzle.db().query.users.findMany({
      limit,
      offset,
    });

    return {...res}
  }
}