import { relations } from 'drizzle-orm';
import { bigint, mysqlEnum, mysqlTable, serial } from 'drizzle-orm/mysql-core';
import { provinces } from './provinces';

export const country = mysqlEnum('country', [
  'vietnam',
  'cambodia',
  'thailand',
  'myanmar',
  'china',
  'airport',
]);

export const provinceCountry = mysqlTable('province_country', {
  id: serial('id').primaryKey().notNull(),
  country: country.notNull(),
  provinceId: bigint('province_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => provinces.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
});

export const provinceCountryRelations = relations(
  provinceCountry,
  ({ one }) => ({
    province: one(provinces, {
      fields: [provinceCountry.provinceId],
      references: [provinces.id],
    }),
  }),
);

export type ProvinceCountry = typeof provinceCountry.$inferSelect;
export type InsertProvinceCountry = typeof provinceCountry.$inferInsert;
