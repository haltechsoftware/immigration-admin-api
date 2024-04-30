import { relations } from 'drizzle-orm';
import {
  bigint,
  foreignKey,
  mysqlTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { checkpointCategories } from './checkpoint_categories';

export const checkpointCategoryTranslate = mysqlTable(
  'checkpoint_category_translate',
  {
    id: serial('id').primaryKey().notNull(),
    category_id: bigint('checkpoint_category_id', {
      mode: 'number',
      unsigned: true,
    }),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull().unique(),
    description: text('description'),
    lang: langCode.notNull(),
  },
  (t) => ({
    checkpointCategoryReference: foreignKey({
      columns: [t.category_id],
      foreignColumns: [checkpointCategories.id],
      name: 'checkpoint_cat_translate_id_fk',
    }).onDelete('cascade'),
  }),
);

export const checkpointCategoryTranslateRelations = relations(
  checkpointCategoryTranslate,
  ({ one }) => ({
    checkpoint_category: one(checkpointCategories, {
      fields: [checkpointCategoryTranslate.category_id],
      references: [checkpointCategories.id],
    }),
  }),
);
