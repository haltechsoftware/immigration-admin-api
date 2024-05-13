import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { checkpointCategories } from 'src/modules/checkpoints/entities';
import { GetAllCheckpointCategoryCommand } from '../impl/get-all';

@QueryHandler(GetAllCheckpointCategoryCommand)
export class QueryGetAllCheckpointCategoryHandler
  implements IQueryHandler<any>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private _prepared = this._drizzle
    .db()
    .select({ value: count() })
    .from(checkpointCategories)
    .prepare();

  async execute({
    query: { limit, offset },
  }: GetAllCheckpointCategoryCommand): Promise<any> {
    const res = await this._drizzle.db().query.checkpointCategories.findMany({
      with: {
        translates: {
          columns: {
            description: false,
            category_id: false,
            slug: false,
          },
        },
      },
      limit,
      offset,
    });

    const total = await this._prepared.execute();

    return {
      data: res,
      count: total[0].value,
    };
  }
}
