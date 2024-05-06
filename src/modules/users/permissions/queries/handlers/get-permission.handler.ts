import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { Permission, permissions } from 'src/modules/users/entities';
import GetPermissionsQuery from '../impl/get-permission.query';

@QueryHandler(GetPermissionsQuery)
export class GetPermissionHandler
  implements IQueryHandler<GetPermissionsQuery, Permission[]>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private prepared = this.drizzle.db().select().from(permissions).prepare();

  async execute(): Promise<Permission[]> {
    return await this.prepared.execute();
  }
}
