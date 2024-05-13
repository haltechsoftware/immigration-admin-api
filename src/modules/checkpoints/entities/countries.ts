import { relations } from 'drizzle-orm';
import {
  boolean,
  mysqlTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { countriesToProvinces } from './countries_to_provinces';
import { countryTranslate } from './country_translate';

export const countries = mysqlTable('countries', {
  id: serial('id').primaryKey().notNull(),
  image: text('image'),
  is_except_visa: boolean('is_except_visa').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const countriesRelations = relations(countries, ({ many }) => ({
  translates: many(countryTranslate),
  provinces: many(countriesToProvinces),
}));
export type Countries = typeof countries.$inferSelect;
export type InsertCountries = typeof countries.$inferInsert;
