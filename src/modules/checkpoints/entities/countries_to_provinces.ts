import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { countries } from './countries';
import { provinces } from './provinces';

export const countriesToProvinces = pgTable(
  'countries_to_provinces',
  {
    country_id: integer('country_id')
      .notNull()
      .references(() => countries.id),
    province_id: integer('province_id')
      .notNull()
      .references(() => provinces.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.country_id, t.province_id] }),
  }),
);

export const countriesToProvincesRelations = relations(
  countriesToProvinces,
  ({ one }) => ({
    country: one(countries, {
      fields: [countriesToProvinces.country_id],
      references: [countries.id],
    }),
    province: one(provinces, {
      fields: [countriesToProvinces.province_id],
      references: [provinces.id],
    }),
  }),
);
