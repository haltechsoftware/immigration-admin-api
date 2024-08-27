import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneCheckpointCommand } from '../impl/get-one';

@QueryHandler(GetOneCheckpointCommand)
export class QueryGetOneCheckpointHandler
  implements IQueryHandler<GetOneCheckpointCommand>
{
  constructor(private readonly _drizzle: DrizzleService) {}

  async execute({ id }: GetOneCheckpointCommand): Promise<any> {
    const res = await this._drizzle.db().query.checkpoints.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: {
          columns: {
            checkpoint_id: false,
          },
        },
        category: {
          columns: { id: true },
          with: {
            translates: {
              columns: {
                id: true,
                title: true,
                lang: true,
              },
            },
          },
        },
        province: {
          columns: { id: true },
          with: {
            translates: {
              columns: {
                id: true,
                name: true,
                lang: true,
              },
            },
          },
        },
      },
    });

    if (!res) throw new NotFoundException({ message: 'ບໍ່ພົບຂໍ້ມູນແຂວງນີ້' });

    return res;
  }
}
