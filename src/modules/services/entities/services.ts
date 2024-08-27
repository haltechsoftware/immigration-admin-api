import { relations } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';
import { serviceTranslate } from './service_translate';

export const services = mysqlTable('services', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const serviceRelations = relations(services, ({ many }) => ({
  translates: many(serviceTranslate),
}));

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
