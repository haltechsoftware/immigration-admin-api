import { relations } from 'drizzle-orm';
import {
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { rolesToPermissions } from './roles_to_permissions';

export const permissions = mysqlTable('permissions', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  group_name: varchar('group_name', { length: 50 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
}));

export type Permission = typeof permissions.$inferSelect;
