import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, count, eq } from 'drizzle-orm/sql';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { checkpoints } from 'src/modules/checkpoints/entities';
import { GetAllCheckpointCommand } from '../impl/get-all';
import { GetAllClientCheckpointCommand } from '../impl/get-all-client-checkpoint';

@QueryHandler(GetAllClientCheckpointCommand)
export class QueryGetAllClientCheckpointHandler implements IQueryHandler<GetAllClientCheckpointCommand> {
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({
    query: { lang, category_id, limit, offset },
  }: GetAllClientCheckpointCommand): Promise<any> {
    const conditional = and(
      category_id ? eq(checkpoints.category_id, category_id) : undefined,
    );

    const res = await this._drizzle.db().query.checkpoints.findMany({
      columns: {
        // category_id: true,
        province_id: false,
        // country_id: false,
        link_map: false,
        created_at: false,
        updated_at: false,
      },
      with: {
        translates: {
            where: lang ? (fields, operators) => operators.eq(fields.lang, lang) : undefined,
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
      total: total[0].value,
    };
  }
}
