import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { checkpoints } from './checkpoints';
import { provinceTranslate } from './province_translate';
import { countriesToProvinces } from './countries_to_provinces';

export const provinces = pgTable('provinces', {
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
  countries: many(countriesToProvinces),
}));

export type Provinces = typeof provinces.$inferSelect;
export type InsertProvinces = typeof provinces.$inferInsert;
