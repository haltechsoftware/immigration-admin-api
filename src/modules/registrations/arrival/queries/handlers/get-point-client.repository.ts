import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import GetPointClientQuery from "../impl/get-point-client.query";

@QueryHandler(GetPointClientQuery)
export class queryPointClientHandler
  implements IQueryHandler<GetPointClientQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { lang, limit, offset },
  }: GetPointClientQuery): Promise<any> {
    const checkpointsList = await this._drizzle.db().query.checkpoints.findMany({
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

    const result = checkpointsList.map((checkpoint) => ({
      id: checkpoint.id,
      name: checkpoint.translates?.[0]?.name ?? null,
      slug: checkpoint.translates?.[0]?.slug ?? null,
    }));

    return {
      data: result,
    };
  }
}
