import { relations } from 'drizzle-orm';
import { bigint, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { countries } from './countries';
import { provinces } from './provinces';

export const countriesToProvinces = mysqlTable(
  'countries_to_provinces',
  {
    country_id: bigint('country_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => countries.id, { onDelete: 'cascade' }),
    province_id: bigint('province_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => provinces.id, { onDelete: 'cascade' }),
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
