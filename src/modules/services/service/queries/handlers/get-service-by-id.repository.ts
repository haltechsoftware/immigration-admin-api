import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetServiceByIdQuery } from '../impl/get-service-by-id.query';

@QueryHandler(GetServiceByIdQuery)
export class GetServiceByIdHandler
  implements IQueryHandler<GetServiceByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id }: GetServiceByIdQuery) {
    const res = await this.drizzle.db().query.services.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: true,
      },
    });

    if (!res)
      throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນການບໍລິການ' });

    return res;
  }
}
