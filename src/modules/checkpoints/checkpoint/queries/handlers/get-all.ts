import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { checkpoints } from 'src/modules/checkpoints/entities';
import { GetAllCheckpointCommand } from '../impl/get-all';

@QueryHandler(GetAllCheckpointCommand)
export class QueryGetAllCheckpointHandler implements IQueryHandler<any> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { category_id, limit, offset, province_id },
  }: GetAllCheckpointCommand): Promise<any> {
    const conditional = and(
      category_id ? eq(checkpoints.category_id, category_id) : undefined,
      province_id ? eq(checkpoints.province_id, province_id) : undefined,
    );

    const res = await this._drizzle.db().query.checkpoints.findMany({
      columns: {
        category_id: false,
        province_id: false,
        country_id: false,
        link_map: false,
        created_at: false,
        updated_at: false,
      },
      with: {
        translates: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      offset,
      limit,
      where: conditional,
    });

    const total = await this._drizzle
      .db()
      .select({ value: count() })
      .from(checkpoints)
      .where(conditional);

    return {
      data: res,
      count: total[0].value,
    };
  }
}
