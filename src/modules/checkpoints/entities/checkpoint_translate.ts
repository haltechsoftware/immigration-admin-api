import { relations } from 'drizzle-orm';

import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { langCode } from 'src/modules/banners/entities';
import { checkpoints } from './checkpoints';

export const checkpointTranslate = pgTable('checkpoint_translate', {
  id: serial('id').primaryKey().notNull(),
  checkpoint_id: integer('checkpoint_id').references(() => checkpoints.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  content: text('content'),
  address: text('address'),
  lang: langCode('lang').notNull(),
});

export const checkpointTranslateRelations = relations(
  checkpointTranslate,
  ({ one }) => ({
    checkpoint: one(checkpoints, {
      fields: [checkpointTranslate.checkpoint_id],
      references: [checkpoints.id],
    }),
  }),
);
