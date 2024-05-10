import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneProvinceCommand } from '../impl/get-one.province';

@QueryHandler(GetOneProvinceCommand)
export class QueryGetOneProvinceHandler
  implements IQueryHandler<GetOneProvinceCommand>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  async execute({ id }: GetOneProvinceCommand): Promise<any> {
    const res = await this._drizzle.db().query.provinces.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          columns: {
            province_id: false,
          },
        },
      },
    });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

    return res;
  }
}
