import { relations } from 'drizzle-orm';
import {
  char,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { blackListStatus } from './backlist_status.enum';
import { passportInformation } from './passport_information';
import { personalInformation } from './personal_information';

export const departureRegistration = pgTable('departure_registration', {
  id: serial('id').primaryKey().notNull(),
  passport_information_id: integer('passport_information_id').references(
    () => passportInformation.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  personal_information_id: integer('personal_information_id').references(
    () => personalInformation.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  departure_name: varchar('departure_name', { length: 255 }).notNull(),
  last_leaving: varchar('last_leaving', { length: 255 }).notNull(),
  verification_code: char('verification_code', { length: 10 })
    .notNull()
    .unique(),
  black_list: blackListStatus('black_list').notNull(),
  created_at: timestamp('created_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const departureRegistrationRelations = relations(
  departureRegistration,
  ({ one }) => ({
    passport_information: one(passportInformation, {
      fields: [departureRegistration.passport_information_id],
      references: [passportInformation.id],
    }),
    personal_information: one(personalInformation, {
      fields: [departureRegistration.personal_information_id],
      references: [personalInformation.id],
    }),
  }),
);
