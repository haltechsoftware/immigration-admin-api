import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { IPaginated } from 'src/common/interface/pagination/paginated.interface';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { roles } from 'src/modules/users/entities';
import GetRoleQuery from '../impl/get-role.query';

@QueryHandler(GetRoleQuery)
export class GetRoleHandler
  implements IQueryHandler<GetRoleQuery, IPaginated<any>>
{
  constructor(private readonly drizzle: DrizzleService) {}

  private _getCount = this.drizzle
    .db()
    .select({ value: count() })
    .from(roles)
    .where(eq(roles.is_default, false))
    .prepare();

  async execute({ paginate: { limit, offset } }: GetRoleQuery) {
    const res = await this.drizzle.db().query.roles.findMany({
      limit,
      offset,
      where: (fields, { eq }) => eq(fields.is_default, false),
      with: { rolesToPermissions: { with: { permission: true } } },
    });
    const total = await this._getCount.execute();

    return {
      data: res.map((val) => ({
        ...val,
        permissions: val.rolesToPermissions.map((val) => val.permission),
        rolesToPermissions: undefined,
      })),
      total: total[0].value,
    };
  }
}
