import { relations } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';
import { checkpoints } from './checkpoints';
import { provinceCountry } from './province_country';
import { provinceTranslate } from './province_translate';

export const provinces = mysqlTable('provinces', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const provincesRelations = relations(provinces, ({ many }) => ({
  checkpoints: many(checkpoints),
  translates: many(provinceTranslate),
  countries: many(provinceCountry),
}));

export type Provinces = typeof provinces.$inferSelect;
export type InsertProvinces = typeof provinces.$inferInsert;
