import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { count, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { users, usersToRoles, roles } from 'src/modules/users/entities';
import GetUserQuery from '../impl/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly drizzle: DrizzleService) {}

  private _prepared = this.drizzle
    .db()
    .select({ value: count() })
    .from(users)
    // new
    .leftJoin(usersToRoles, eq(users.id, usersToRoles.user_id))
    .leftJoin(roles, eq(usersToRoles.role_id, roles.id))
    .where(eq(roles.is_default, false))
    .prepare();

  async execute({ paginate: { offset, limit } }: GetUserQuery) {
    const res = await this.drizzle.db().query.users.findMany({
      with: {
        profile: true,
        sessions: {
          orderBy: ({ created_at }, { desc }) => [desc(created_at)],
          limit: 1,
        },
        usersToRoles: { with: { role: true } },
      },
      limit,
      offset,
    });
    // const total = await this._prepared.execute();

    // return {
    //   data: res.map((val) => ({
    //     ...val,
    //     roles: val.usersToRoles.map(({ role }) => role),
    //     usersToRoles: undefined,
    //     session: val.sessions[0],
    //     sessions: undefined,
    //   })),
    //   total: total[0].value,
    // };

    const filtered = res.filter((user) =>
      user.usersToRoles.some(({ role }) => role.is_default === false),
    );

    const data = filtered.map((val) => ({
      ...val,
      roles: val.usersToRoles.map(({ role }) => role),
      usersToRoles: undefined,
      session: val.sessions[0],
      sessions: undefined,
    }));

    const total = await this._prepared.execute();

    return {
      data,
      total: total[0].value,
    };
  }
}
