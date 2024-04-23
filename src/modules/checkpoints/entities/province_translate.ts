import { relations } from 'drizzle-orm';

import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { provinces } from './provinces';

export const provinceTranslate = pgTable('province_translate', {
  id: serial('id').primaryKey().notNull(),
  province_id: integer('province_id').references(() => provinces.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  lang: langCode('lang').notNull(),
});

export const provinceTranslateRelations = relations(
  provinceTranslate,
  ({ one }) => ({
    province: one(provinces, {
      fields: [provinceTranslate.province_id],
      references: [provinces.id],
    }),
  }),
);
