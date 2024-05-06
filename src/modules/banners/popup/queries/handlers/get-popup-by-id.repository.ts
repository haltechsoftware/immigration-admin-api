import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from '../../../../../infrastructure/drizzle/drizzle.service';
import GetPopupByIdQuery from '../impl/get-popup-by-id.query';

@QueryHandler(GetPopupByIdQuery)
export class GetPopupByIdHandler implements IQueryHandler<GetPopupByIdQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.bannerPopups.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare();

  async execute({ id }: GetPopupByIdQuery) {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ປ໊ອບອັບບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
