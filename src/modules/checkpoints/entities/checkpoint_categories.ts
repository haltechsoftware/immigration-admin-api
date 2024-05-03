import { relations } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';
import { checkpointCategoryTranslate } from './checkpoint_category_translate';
import { checkpoints } from './checkpoints';

export const checkpointCategories = mysqlTable('checkpoint_categories', {
  id: serial('id').primaryKey().notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const checkpointCategoriesRelations = relations(
  checkpointCategories,
  ({ many }) => ({
    translates: many(checkpointCategoryTranslate),
    checkpoints: many(checkpoints),
  }),
);
