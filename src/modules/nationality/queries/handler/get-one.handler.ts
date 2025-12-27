import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneNationalityQuery } from '../impl/get-one.query';

@QueryHandler(GetOneNationalityQuery)
export class GetOneNationalityHandler
  implements IQueryHandler<GetOneNationalityQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}
  private prepared = this.drizzle
    .db()
    .query.nationality.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare();

  async execute({ id }: GetOneNationalityQuery): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ຂໍ້ມູນນີ້ບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
