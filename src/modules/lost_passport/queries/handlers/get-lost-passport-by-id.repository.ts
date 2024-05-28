import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetLostPassportByIdQuery } from '../impl/get-lost-passport-by-id.query';

@QueryHandler(GetLostPassportByIdQuery)
export class GetLostPassportByIdHandler
  implements IQueryHandler<GetLostPassportByIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ id }: GetLostPassportByIdQuery) {
    const res = await this.drizzle.db().query.lostPassport.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: true,
      },
    });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນ' });

    return res;
  }
}
