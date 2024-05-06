import { relations } from 'drizzle-orm';
import { visaCategoryTranslate } from './visa_category_translate';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const visaCategories = mysqlTable('visa_categories', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const visaCategoriesRelations = relations(
  visaCategories,
  ({ many }) => ({
    translates: many(visaCategoryTranslate),
  }),
);

export type VisaCategory = typeof visaCategories.$inferSelect;
export type InsertVisaCategory = typeof visaCategories.$inferInsert;
