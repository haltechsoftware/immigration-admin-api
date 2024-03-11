import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertSession, sessions } from '../../entities';

@Injectable()
export class AuthRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  private _checkUserPrepared = this.drizzle
    .db()
    .query.users.findFirst({
      with: {
        profile: true,
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
      where: (fields, { eq }) => eq(fields.email, sql.placeholder('email')),
    })
    .prepare('check_user');

  async checkUser(email: string) {
    const res = await this._checkUserPrepared.execute({ email });

    if (res)
      return {
        ...res,
        roles: res.usersToRoles.map(({ role }) => ({
          ...role,
          permissions: role.rolesToPermissions.map(
            ({ permission }) => permission,
          ),
        })),
      };
  }

  async createSession(session: InsertSession) {
    await this.drizzle.db().insert(sessions).values(session);
  }

  private _getPrepared = this.drizzle
    .db()
    .query.sessions.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
    })
    .prepare('get_session');

  async getSession(id: string) {
    const res = await this._getPrepared.execute({ id });

    if (res) return res;
  }

  async removeSession(id: string) {
    await this.drizzle.db().delete(sessions).where(eq(sessions.id, id));
  }
}
