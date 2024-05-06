import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { sql } from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common';
import GetLawByIdQuery from '../impl/get-law-by-id.query';

@QueryHandler(GetLawByIdQuery)
export class GetLawByIdHandler implements IQueryHandler<GetLawByIdQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.laws.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('get_law_by_id');

  async execute({ id }: GetLawByIdQuery) {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ມີໄອດີ້ໃນລະບົບ' });

    return res;
  }
}
