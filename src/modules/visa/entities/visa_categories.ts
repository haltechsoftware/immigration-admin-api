import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { visaCategoryTranslate } from './visa_category_translate';

export const visaCategories = pgTable('visa_categories', {
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

