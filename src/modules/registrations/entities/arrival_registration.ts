import { relations } from 'drizzle-orm';
import {
  boolean,
  char,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { blackListStatus } from './backlist_status.enum';
import { intendedAddress } from './intended_address';
import { passportInformation } from './passport_information';
import { personalInformation } from './personal_information';
import { visaInformation } from './visa_information';

export const arrivalPurpose = pgEnum('arrival_purpose', [
  'diplomatic',
  'official',
  'visit',
  'business',
  'tourism',
  'transit',
]);

export const travelingByType = pgEnum('traveling_by_type', [
  'flight',
  'car',
  'bus',
]);

export const arrivalRegistration = pgTable('arrival_registration', {
  id: serial('id').primaryKey().notNull(),
  passport_information_id: integer('passport_information_id').references(
    () => passportInformation.id,
    {
      onDelete: 'cascade',
      onUpdate: 'no action',
    },
  ),
  visa_information_id: integer('visa_information_id').references(
    () => visaInformation.id,
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
  entry_name: varchar('entry_name', { length: 255 }).notNull(),
  purpose: arrivalPurpose('purpose').notNull(),
  traveling_by_type: travelingByType('traveling_by_type').notNull(),
  traveling_by_no: varchar('traveling_by_no', { length: 255 }).notNull(),
  traveling_from: varchar('traveling_from', { length: 255 }).notNull(),
  is_traveling_in_tour: boolean('is_traveling_in_tour').notNull(),
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

export const arrivalRegistrationRelations = relations(
  arrivalRegistration,
  ({ one, many }) => ({
    passport_information: one(passportInformation, {
      fields: [arrivalRegistration.passport_information_id],
      references: [passportInformation.id],
    }),
    visa_information: one(visaInformation, {
      fields: [arrivalRegistration.visa_information_id],
      references: [visaInformation.id],
    }),
    personal_information: one(personalInformation, {
      fields: [arrivalRegistration.personal_information_id],
      references: [personalInformation.id],
    }),
    intended_address: many(intendedAddress),
  }),
);
