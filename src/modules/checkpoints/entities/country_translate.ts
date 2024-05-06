import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { countries } from './countries';

export const countryTranslate = mysqlTable('country_translate', {
  id: serial('id').primaryKey().notNull(),
  country_id: bigint('country_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => countries.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  lang: langCode.notNull(),
});

export const countryTranslateRelations = relations(
  countryTranslate,
  ({ one }) => ({
    country: one(countries, {
      fields: [countryTranslate.country_id],
      references: [countries.id],
    }),
  }),
);
