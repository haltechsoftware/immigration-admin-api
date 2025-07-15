import { relations } from 'drizzle-orm';
import {
  bigint,
  char,
  date,
  foreignKey,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { blackListStatus } from './backlist_status.enum';
import { passportInformation } from './passport_information';
import { personalInformation } from './personal_information';
import { users } from 'src/modules/users/entities';

export const departureRegistration = mysqlTable(
  'departure_registration',
  {
    id: serial('id').primaryKey().notNull(),
    passport_information_id: bigint('passport_information_id', {
      mode: 'number',
      unsigned: true,
    }),
    personal_information_id: bigint('personal_information_id', {
      mode: 'number',
      unsigned: true,
    }),
    departure_name: varchar('departure_name', { length: 255 }).notNull(),
    last_leaving: varchar('last_leaving', { length: 255 }).notNull(),
    verification_code: char('verification_code', { length: 10 }).unique(),
    verified_at: timestamp('verified_at', { mode: 'string' }),
    verified_by: bigint('verified_by', {
      mode: 'number',
      unsigned: true,
    }),
    black_list: blackListStatus.notNull(),
    check_in_date: date('check_in_date'),
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
      name: 'dep_reg_passport_info_id_fk',
    }).onDelete('set null'),
    personalInformationReference: foreignKey({
      columns: [table.personal_information_id],
      foreignColumns: [personalInformation.id],
      name: 'dep_reg_personal_info_id_fk',
    }).onDelete('set null'),

    verifiedByReference: foreignKey({
      columns: [table.verified_by],
      foreignColumns: [users.id],
      name: 'dep_reg_verified_by_fk',
    }).onDelete('set null'),
  }),
);

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
    verified_by_user: one(users, {
      fields: [departureRegistration.verified_by],
      references: [users.id],
    }),
  }),
);
