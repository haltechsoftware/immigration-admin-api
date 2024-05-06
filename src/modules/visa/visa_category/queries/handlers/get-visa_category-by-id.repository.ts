import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneVisaCategoryQuery } from '../impl/get-visa_category-by-id.query';

@QueryHandler(GetOneVisaCategoryQuery)
export class GetOneVisaCategoryQueryHandler
  implements IQueryHandler<GetOneVisaCategoryQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private prepared = this._drizzle
    .db()
    .query.visaCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();

  async execute({ id }: GetOneVisaCategoryQuery): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res)
      throw new NotFoundException({ message: 'ປະເພດວີຊານີ້ບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
