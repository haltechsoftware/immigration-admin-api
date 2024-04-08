import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import GetUserByIdQuery from '../impl/get-user-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly drizzle: DrizzleService) {}
  
  private prepared = this.drizzle
    .db()
    .query.users.findFirst({
      columns: { password: false },
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        profile: true,
        sessions: { orderBy: ({ created_at }, { desc }) => desc(created_at) },
        usersToRoles: {
          with: {
            role: {
              with: {
                rolesToPermissions: {
                  with: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .prepare('get_user_by_id');

  async execute({ id }: GetUserByIdQuery) {
    const res = await this.prepared.execute({ id });

    if (!res) return;

    const permissions: string[] = [];

    if (res.usersToRoles)
      res.usersToRoles.forEach(({ role: { rolesToPermissions } }) => {
        if (rolesToPermissions)
          rolesToPermissions.forEach(({ permission: { name } }) => {
            if (!permissions.includes(name)) permissions.push(name);
          });
      });

    return {
      ...res,
      roles: res.usersToRoles.map(({ role }) => ({
        ...role,
        rolesToPermissions: undefined,
      })),
      usersToRoles: undefined,
      permissions,
      session: res.sessions[0],
      sessions: undefined,
    };
  }
}
