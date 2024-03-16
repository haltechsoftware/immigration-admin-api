import { relations } from 'drizzle-orm';
import { integer, json, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { visaCategories } from './visa_categories';

export const visaCategoryTranslate = pgTable('visa_category_translate', {
  id: serial('id').primaryKey().notNull(),
  visa_category_id: integer('visa_category_id').references(
    () => visaCategories.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  name: varchar('name', { length: 255 }).notNull(),
  content: json('content'),
  lang: langCode('lang').notNull(),
});

export const visaCategoryTranslateRelations = relations(
  visaCategoryTranslate,
  ({ one }) => ({
    visa_category: one(visaCategories, {
      fields: [visaCategoryTranslate.visa_category_id],
      references: [visaCategories.id],
    }),
  }),
);
