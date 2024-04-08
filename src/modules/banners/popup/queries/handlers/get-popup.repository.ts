import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { and, count, eq, gt, gte, lt, lte, or } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { bannerPopups } from 'src/modules/banners/entities';
import GetPopupQuery from '../impl/get-popup.query';

@QueryHandler(GetPopupQuery)
export class GetPopupHandler implements IQueryHandler<GetPopupQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    query: { offset, limit, is_inactive, is_private },
  }: GetPopupQuery) {
    const isPrivateCondition =
      is_private !== undefined
        ? eq(bannerPopups.is_private, is_private === '1' ? true : false)
        : undefined;

    const isInactiveCondition =
      is_inactive !== undefined
        ? is_inactive === '1'
          ? or(
              gt(
                bannerPopups.start_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
              lt(
                bannerPopups.end_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
            )
          : and(
              lte(
                bannerPopups.start_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
              gte(
                bannerPopups.end_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
            )
        : undefined;

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
