import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetFileAndFolderByParentIdQuery } from '../impl/get-file-and-folder-by-parent-id.query';

@QueryHandler(GetFileAndFolderByParentIdQuery)
export class GetFileAndFolderByParentIdHandler
  implements IQueryHandler<GetFileAndFolderByParentIdQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ dto: { parent_id } }: GetFileAndFolderByParentIdQuery) {
    return await this.drizzle.db().query.filesAndDirectories.findMany({
      where: (fields, operators) =>
        parent_id === undefined
          ? undefined
          : parent_id === 0
          ? operators.isNull(fields.parent_id)
          : operators.eq(fields.parent_id, parent_id),
      orderBy: (fields, operators) => operators.asc(fields.type),
    });
  }
}
