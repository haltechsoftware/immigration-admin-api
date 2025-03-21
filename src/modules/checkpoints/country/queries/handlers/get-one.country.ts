import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneCountryCommand } from '../impl/get-one.country';

@QueryHandler(GetOneCountryCommand)
export class QueryGetOneCountryHandler
  implements IQueryHandler<GetOneCountryCommand>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  async execute({ id }: GetOneCountryCommand): Promise<any> {
    const res = await this._drizzle.db().query.countries.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: { columns: { country_id: false } },
      },
    });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

    return res;
  }
}
