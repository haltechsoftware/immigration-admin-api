import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetAccommodationByIdRequestQuery } from '../impl/get-accommodation-request-by-id.query';

@QueryHandler(GetAccommodationByIdRequestQuery)
export class GetAccommodationByIdHandler
  implements IQueryHandler<GetAccommodationByIdRequestQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id }: GetAccommodationByIdRequestQuery) {
    const res = await this.drizzle.db().query.accommodationRequest.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: true,
      },
    });

    if (!res)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການຮ້ອງຂໍທີ່ພັກ' });

    return res;
  }
}
