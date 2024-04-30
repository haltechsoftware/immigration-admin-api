import { relations } from 'drizzle-orm';
import { bigint, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { roles } from './roles';
import { users } from './users';

export const usersToRoles = mysqlTable(
  'users_to_roles',
  {
    user_id: bigint('user_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role_id: bigint('role_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      usersToRolesUserIdRoleIdPk: primaryKey({
        columns: [table.user_id, table.role_id],
        name: 'users_to_roles_user_id_role_id_pk',
      }),
    };
  },
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
  user: one(users, {
    fields: [usersToRoles.user_id],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [usersToRoles.role_id],
    references: [roles.id],
  }),
}));
