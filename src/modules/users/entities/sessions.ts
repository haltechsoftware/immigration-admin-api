import { relations } from 'drizzle-orm';
import { bigint, char, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const sessions = mysqlTable('sessions', {
  id: char('id', { length: 36 }).primaryKey().notNull(),
  user_id: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.user_id], references: [users.id] }),
}));

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
