import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { checkpointCategories } from './checkpoint_categories';

export const checkpointCategoryTranslate = pgTable(
  'checkpoint_category_translate',
  {
    id: serial('id').primaryKey().notNull(),
    category_id: integer('checkpoint_category_id').references(
      () => checkpointCategories.id,
      {
        onDelete: 'cascade',
        onUpdate: 'no action',
      },
    ),
    title: varchar('title', { length: 255 }),
    description: text('description'),
    lang: langCode('lang').notNull(),
  },
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
