import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { checkpoints } from './checkpoints';
import { countriesToProvinces } from './countries_to_provinces';
import { countryTranslate } from './country_translate';

export const countries = pgTable('countries', {
  id: serial('id').primaryKey().notNull(),
  image: text('image').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const countriesRelations = relations(countries, ({ many }) => ({
  checkpoints: many(checkpoints),
  translates: many(countryTranslate),
  provinces: many(countriesToProvinces),
}));
