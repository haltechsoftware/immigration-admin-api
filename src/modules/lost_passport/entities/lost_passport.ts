import { relations } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';
import { lostPassportTranslate } from './lost_passport_translate';

export const lostPassport = mysqlTable('lost_passport', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const LostPassportRelations = relations(lostPassport, ({ many }) => ({
  translates: many(lostPassportTranslate),
}));

export type LostPassport = typeof lostPassport.$inferSelect;
export type InsertLostPassport = typeof lostPassport.$inferInsert;
