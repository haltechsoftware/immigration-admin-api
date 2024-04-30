import { relations } from 'drizzle-orm';
import { bigint, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { permissions } from './permissions';
import { roles } from './roles';

export const rolesToPermissions = mysqlTable(
  'roles_to_permissions',
  {
    role_id: bigint('role_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permission_id: bigint('permission_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      rolesToPermissionsRoleIdPermissionIdPk: primaryKey({
        columns: [table.role_id, table.permission_id],
        name: 'roles_to_permissions_role_id_permission_id_pk',
      }),
    };
  },
);

export const rolesToPermissionsRelations = relations(
  rolesToPermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolesToPermissions.role_id],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolesToPermissions.permission_id],
      references: [permissions.id],
    }),
  }),
);
