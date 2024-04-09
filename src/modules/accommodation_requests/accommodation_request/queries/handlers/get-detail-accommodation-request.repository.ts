import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetDetailAccommodationRequest } from '../impl/get-detail-accommodation-request';

@QueryHandler(GetDetailAccommodationRequest)
export class DetailAccommodationRequestHandler
  implements IQueryHandler<GetDetailAccommodationRequest>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle
    .db()
    .query.accommodationRequest.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        translates: true,
      },
    })
    .prepare('get_accommodation-request-detail');

  async execute({ id }: GetDetailAccommodationRequest) {
    const res = await this.prepared.execute({ id });

    if (!res)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກ' });

    return res;
  }
}
