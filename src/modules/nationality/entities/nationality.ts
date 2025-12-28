import { relations } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';
import { nationalityTranslate } from './nationality-translate';
import { personalInformation } from 'src/modules/registrations/entities';

export const nationality = mysqlTable('nationalities', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const nationalityRelations = relations(nationality, ({ many }) => ({
  translates: many(nationalityTranslate),
  personal_information: many(personalInformation),
}));

export type Nationality = typeof nationality.$inferSelect;
export type InsertNationality = typeof nationality.$inferInsert;
