import { relations } from 'drizzle-orm';
import {
  bigint,
  mysqlTable,
  serial,
  text,
  varchar,
  json,
} from 'drizzle-orm/mysql-core';
import { langCode } from 'src/modules/banners/entities';
import { checkpoints } from './checkpoints';

export const checkpointTranslate = mysqlTable('checkpoint_translate', {
  id: serial('id').primaryKey().notNull(),
  checkpoint_id: bigint('checkpoint_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => checkpoints.id, {
    onDelete: 'cascade',
  }),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  content: json('content'),
  address: text('address'),
  lang: langCode.notNull(),
  time_operation: text('time_operation'),
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

export type CheckPointTranslate = typeof checkpointTranslate.$inferSelect;
export type InsertCheckPointTranslate = typeof checkpointTranslate.$inferInsert;
