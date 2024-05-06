import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  char,
  foreignKey,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { countries } from 'src/modules/checkpoints/entities';
import { blackListStatus } from './backlist_status.enum';
import { intendedAddress } from './intended_address';
import { passportInformation } from './passport_information';
import { personalInformation } from './personal_information';
import { visaInformation } from './visa_information';

export const purpose = mysqlEnum('purpose', [
  'transit',
  'tourism',
  'business',
  'visit',
  'official',
  'diplomatic',
]);

export const travelingByType = mysqlEnum('traveling_by_type', [
  'bus',
  'car',
  'flight',
]);

export const arrivalRegistration = mysqlTable(
  'arrival_registration',
  {
    id: serial('id').primaryKey().notNull(),
    passport_information_id: bigint('passport_information_id', {
      mode: 'number',
      unsigned: true,
    }),
    visa_information_id: bigint('visa_information_id', {
      mode: 'number',
      unsigned: true,
    }),
    personal_information_id: bigint('personal_information_id', {
      mode: 'number',
      unsigned: true,
    }),
    country_id: bigint('country_id', {
      mode: 'number',
      unsigned: true,
    }),
    entry_name: varchar('entry_name', { length: 255 }).notNull(),
    purpose: purpose.notNull(),
    traveling_by_type: travelingByType.notNull(),
    traveling_by_no: varchar('traveling_by_no', { length: 255 }).notNull(),
    is_traveling_in_tour: boolean('is_traveling_in_tour').notNull(),
    verification_code: char('verification_code', { length: 10 }).unique(),
    verified_at: timestamp('verified_at', { mode: 'string' }),
    black_list: blackListStatus.notNull(),
    created_at: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    passportInformationReference: foreignKey({
      columns: [table.passport_information_id],
      foreignColumns: [passportInformation.id],
      name: 'arrival_reg_passport_info_id_fk',
    }).onDelete('set null'),
    visaInformationReference: foreignKey({
      columns: [table.visa_information_id],
      foreignColumns: [visaInformation.id],
      name: 'arrival_reg_visa_info_id_fk',
    }).onDelete('set null'),
    personalInformationReference: foreignKey({
      columns: [table.personal_information_id],
      foreignColumns: [personalInformation.id],
      name: 'arrival_reg_personal_info_id_fk',
    }).onDelete('set null'),
    countryReference: foreignKey({
      columns: [table.country_id],
      foreignColumns: [countries.id],
      name: 'arrival_reg_country_id_fk',
    }).onDelete('set null'),
  }),
);

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
