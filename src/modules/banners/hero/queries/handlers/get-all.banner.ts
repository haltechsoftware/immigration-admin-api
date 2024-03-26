import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { format } from 'date-fns';
import { and, count, eq, gt, gte, lt, lte, or } from 'drizzle-orm';
import { DateTimeFormat } from 'src/common/enum/date-time-fomat.enum';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { banners } from 'src/modules/banners/entities';
import { GetAllBannerQuery } from '../impl/get-all.banner';

@QueryHandler(GetAllBannerQuery)
export class GetAllBannerQueryHandler
  implements IQueryHandler<GetAllBannerQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({
    input,
    paginate: { offset, limit },
  }: GetAllBannerQuery): Promise<any> {
    const isPrivateCondition =
      input.is_private !== undefined
        ? eq(banners.is_private, input.is_private === '1' ? true : false)
        : undefined;

    const isInactiveCondition =
      input.is_inactive !== undefined
        ? input.is_inactive === '1'
          ? or(
              gt(
                banners.start_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
              lt(
                banners.end_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
            )
          : and(
              lte(
                banners.start_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
              gte(
                banners.end_time,
                format(new Date(), DateTimeFormat.Timestamp),
              ),
            )
        : undefined;

    const conditional = and(isPrivateCondition, isInactiveCondition);

    const res = await this.drizzle.db().query.banners.findMany({
      where: conditional,
      limit,
      offset,
    });

    const total = await this.drizzle
      .db()
      .select({ value: count() })
      .from(banners)
      .where(conditional);

    return {
      data: res,
      total: total[0].value,
    };
  }
}
