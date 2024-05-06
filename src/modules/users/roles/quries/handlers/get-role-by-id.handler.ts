import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetRoleByIdQuery from '../impl/get-role-by-id.query';

@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdHandler implements IQueryHandler<GetRoleByIdQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private _prepared = this.drizzle
    .db()
    .query.roles.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      columns: { is_default: false },
      with: {
        rolesToPermissions: { with: { permission: true } },
        usersToRoles: { with: { user: { columns: { password: false } } } },
      },
    })
    .prepare();

  async execute({ id }: GetRoleByIdQuery): Promise<any> {
    const res = await this._prepared.execute({ id });

    if (!res)
      throw new NotFoundException({ message: 'ຂໍ້ມູນບົດບາດນີ້ບໍ່​ມີໃນລະບົບ' });

    return {
      ...res,
      rolesToPermissions: undefined,
      usersToRoles: undefined,
      permissions: res.rolesToPermissions.map((val) => val.permission),
      users: res.usersToRoles.map((val) => val.user),
    };
  }
}
