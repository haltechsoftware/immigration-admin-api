import { relations } from 'drizzle-orm';
import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { checkpointCategories } from './checkpoint_categories';
import { checkpointTranslate } from './checkpoint_translate';

export const checkpoints = pgTable('checkpoints', {
  id: serial('id').primaryKey().notNull(),
  category_id: integer('category_id').references(
    () => checkpointCategories.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  image: text('image').notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: numeric('longitude', { precision: 10, scale: 6 }).notNull(),
  phone_number: varchar('phone_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const checkpointRelations = relations(checkpoints, ({ one, many }) => ({
  category: one(checkpointCategories, {
    fields: [checkpoints.category_id],
    references: [checkpointCategories.id],
  }),
  translates: many(checkpointTranslate),
}));
