import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  InsertProfile,
  InsertUser,
  Profile,
  Role,
  User,
  profiles,
  users,
  usersToRoles,
} from '../entities';

export type InsertUserType = InsertUser & {
  profile: InsertProfile;
  roleIds: number[];
};

export type UpdateUserType = Omit<InsertUserType, 'password'> & {
  password?: string;
};

@Injectable()
export class UserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(input: InsertUserType): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      const userRes = await tx
        .insert(users)
        .values({ email: input.email, password: input.password });

      await tx.insert(profiles).values({
        first_name: input.profile.first_name,
        last_name: input.profile.last_name,
        image: input.profile.image,
        user_id: userRes[0].insertId,
      });

      if (input.roleIds.length > 0) {
        await tx.insert(usersToRoles).values(
          input.roleIds.map((id) => ({
            role_id: id,
            user_id: userRes[0].insertId,
          })),
        );
      }
    });
  }

  private _getByIdPrepared = this.drizzle
    .db()
    .query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, sql.placeholder('id')),
      with: {
        profile: true,
        usersToRoles: { with: { role: true } },
      },
    })
    .prepare();
  async getById(
    id: number,
  ): Promise<void | (User & { profile: Profile; roles: Role[] })> {
    const res = await this._getByIdPrepared.execute({ id });

    if (res) {
      const result = {
        ...res,
        roles: res.usersToRoles.map((val) => val.role),
        usersToRoles: undefined,
      };

      return result;
    }
  }

  async update(input: UpdateUserType): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          email: input.email,
          password: input.password,
          updated_at: input.updated_at,
        })
        .where(eq(users.id, input.id));

      if (input.profile) {
        await tx
          .update(profiles)
          .set({
            first_name: input.profile.first_name,
            last_name: input.profile.last_name,
            image: input.profile.image,
            updated_at: input.updated_at,
          })
          .where(eq(profiles.user_id, input.id));
      }

      if (input.roleIds) {
        await tx.delete(usersToRoles).where(eq(usersToRoles.user_id, input.id));

        await tx.insert(usersToRoles).values(
          input.roleIds.map((id) => ({
            user_id: input.id,
            role_id: id,
          })),
        );
      }
    });
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db().delete(users).where(eq(users.id, id));
  }
}
