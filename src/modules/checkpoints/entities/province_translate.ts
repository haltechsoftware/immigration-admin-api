import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { provinces } from './provinces';

export const provinceTranslate = mysqlTable('province_translate', {
  id: serial('id').primaryKey().notNull(),
  province_id: bigint('province_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => provinces.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  lang: langCode.notNull(),
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
