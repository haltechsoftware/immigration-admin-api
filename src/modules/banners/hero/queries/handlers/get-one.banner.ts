import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneBannerQuery } from '../impl/get-one.banner';

@QueryHandler(GetOneBannerQuery)
export class GetOneBannerQueryHandler
  implements IQueryHandler<GetOneBannerQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}
  private prepared = this.drizzle
    .db()
    .query.banners.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare('find_banner_by_id');

  async execute({ id }: GetOneBannerQuery): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ປ້າຍນີ້ບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
