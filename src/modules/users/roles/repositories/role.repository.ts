import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { InsertRole, Role, roles, rolesToPermissions } from '../../entities';

@Injectable()
export class RoleRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(role: InsertRole, perIds: number[]): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      const roleRes = await tx.insert(roles).values(role);

      console.log(roleRes);

      if (perIds.length > 0) {
        await tx.insert(rolesToPermissions).values(
          perIds.map((id) => ({
            role_id: roleRes[0].insertId,
            permission_id: id,
          })),
        );
      }
    });
  }

  private _preparedGetById = this.drizzle
    .db()
    .query.roles.findFirst({
      where: ({ id }, { eq }) => eq(id, sql.placeholder('id')),
    })
    .prepare();

  async getById(id: number): Promise<void | Role> {
    return await this._preparedGetById.execute({ id });
  }

  async update(insert: InsertRole, perIds: number[]): Promise<void> {
    await this.drizzle.db().transaction(async (tx) => {
      await tx.update(roles).set(insert).where(eq(roles.id, insert.id));

      if (perIds.length > 0) {
        await tx
          .delete(rolesToPermissions)
          .where(eq(rolesToPermissions.role_id, insert.id));

        await tx.insert(rolesToPermissions).values(
          perIds.map((id) => ({
            role_id: insert.id,
            permission_id: id,
          })),
        );
      }
    });
  }

  async remove(id: number): Promise<void> {
    await this.drizzle.db().delete(roles).where(eq(roles.id, id));
  }
}
