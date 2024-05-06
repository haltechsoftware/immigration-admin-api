import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetContactByIdQuery from '../impl/get-contact-by-id.query';

@QueryHandler(GetContactByIdQuery)
export class GetByIdContactQueryHandler
  implements IQueryHandler<GetContactByIdQuery>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  private prepared = this._drizzle
    .db()
    .query.contacts.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare();

  async execute({ id }: GetContactByIdQuery): Promise<any> {
    const res = await this.prepared.execute({ id });

    if (!res)
      throw new NotFoundException({
        message: 'ຂໍ້ມູນຕິດຕໍ່ພວກເຮົາບໍ່ມີໃນລະບົບ',
      });

    return res;
  }
}
