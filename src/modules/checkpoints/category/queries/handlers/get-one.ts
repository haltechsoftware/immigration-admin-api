import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetOneCheckpointCategoryCommand } from '../impl/get-one';

@QueryHandler(GetOneCheckpointCategoryCommand)
export class QueryGetOneCheckpointCategoryHandler
  implements IQueryHandler<GetOneCheckpointCategoryCommand>
{
  constructor(private readonly _drizzle: DrizzleService) {}
  async execute({ id }: GetOneCheckpointCategoryCommand): Promise<any> {
    const res = await this._drizzle.db().query.checkpointCategories.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        translates: true,
      },
    });

    if (!res) throw new NotFoundException({ message: 'ຂໍ້ມູນບໍ່ມີໃນລະບົບ' });

    return res;
  }
}
