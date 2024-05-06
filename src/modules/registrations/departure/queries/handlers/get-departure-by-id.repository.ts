import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetDepartureByIdQuery from '../impl/get-departure-by-id.query';

@QueryHandler(GetDepartureByIdQuery)
export class GetDepartureByIdHandler
  implements IQueryHandler<GetDepartureByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.departureRegistration.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        passport_information: true,
        personal_information: true,
      },
    })
    .prepare();

  async execute({ id }: GetDepartureByIdQuery) {
    const res = await this.prepared.execute({ id });

    if (!res)
      throw new NotFoundException({ message: 'ລາຍການລົງທະບຽນນີ້ບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
