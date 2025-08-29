import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { and, count, eq, gt, gte, lt, lte, or } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { bannerPopups } from 'src/modules/banners/entities';
import GetPopupClientQuery from '../impl/get-popup-client.query';

@QueryHandler(GetPopupClientQuery)
export class GetPopupClientHandler
  implements IQueryHandler<GetPopupClientQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ query: { offset, limit } }: GetPopupClientQuery) {
    const isPrivateCondition = eq(bannerPopups.is_private, false);

    const now = format(new Date(), DateTimeFormat.Timestamp);

    // 👇 change this flag in code to switch behavior
    const fetchActive = true;

    const isInactiveCondition = fetchActive
      ? and(lte(bannerPopups.start_time, now), gte(bannerPopups.end_time, now))
      : or(gt(bannerPopups.start_time, now), lt(bannerPopups.end_time, now));

    const conditional = and(isPrivateCondition, isInactiveCondition);

    const res = await this.drizzle.db().query.bannerPopups.findMany({
      orderBy: (fields, operators) => operators.desc(fields.updated_at),
      where: conditional,
      limit,
      offset,
    });

    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(bannerPopups)
      .where(conditional);

    return {
      data: res,
      total: total[0].value,
    };
  }
}
