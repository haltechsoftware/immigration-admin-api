import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { GetAllFilesAndDirectoryQuery } from '../impl/get-all.query';

@QueryHandler(GetAllFilesAndDirectoryQuery)
export class GetAllFilesAndDirectoryHandler
  implements IQueryHandler<GetAllFilesAndDirectoryQuery>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async execute({ input: { parent_id } }: GetAllFilesAndDirectoryQuery) {
    const res = await this.drizzle.db().query.filesAndDirectories.findMany({
      with: {
        files_or_directories: {
          columns: { id: true },
          where: (fields, operators) => operators.eq(fields.type, 'directory'),
        },
      },
      where:
        parent_id !== undefined && parent_id !== 0
          ? (fields, operators) => operators.eq(fields.parent_id, parent_id)
          : parent_id !== undefined && parent_id === 0
          ? (fields, operators) => operators.isNull(fields.parent_id)
          : undefined,
    });

    const directories = [];
    const files = [];

    res.forEach((val) => {
      if (val.type === 'directory') {
        directories.push(val);
      } else {
        delete val.files_or_directories;
        files.push(val);
      }
    });

    return {
      directories,
      files,
    };
  }
}
