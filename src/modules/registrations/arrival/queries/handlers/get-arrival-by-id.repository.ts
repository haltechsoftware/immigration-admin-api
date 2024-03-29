import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import GetArrivalByIdQuery from '../impl/get-arrival-by-id.query';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetArrivalByIdQuery)
export class GetArrivalByIdHandler
  implements IQueryHandler<GetArrivalByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.arrivalRegistration.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        passport_information: true,
        visa_information: true,
        personal_information: true,
      },
    })
    .prepare('get_arrival_by_id');

  async execute({ id }: GetArrivalByIdQuery) {
    const res = await this.prepared.execute({ id });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ມີໄອດີ້ໃນລະບົບ' });

    return {
      data: res,
    };
  }
}
