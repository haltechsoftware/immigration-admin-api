import englishOnly from 'src/common/utils/english-only';
import {
  enum_,
  maxLength,
  minLength,
  object,
  optional,
  Output,
  regex,
  string,
} from 'valibot';
import { PersonalInfoSchema } from './personal-info.dto';
import { PassportInfoSchema } from './passport-info.dto';
import { VisaInfoSchema } from './visa-info.dto';
import { IntendedAddressSchema } from './intended-address.dto';
import { ArrivalRegistration } from 'src/common/enum/arrival-registration.enum';
export enum PurposeOfEntry {
  Diplomatic = 'diplomatic',
  Official = 'official',
  Visit = 'visit',
  Business = 'business',
  Tourism = 'tourism',
  Transit = 'transit',
}

export enum travellingByType {
  Flight = 'flight',
  Car = 'car',
  Bus = 'bus',
  Waterway = 'waterway',
  Train = 'train',
}

const ArrivalRegistrationDto = object({
  entry_point: string('ຕ້ອງເປັນສະຕຣິງ.', [
    minLength(1, 'Please enter family name'),
    maxLength(
      255,
      'Please enter family name with a maximum length of 255 characters.',
    ),
    englishOnly(`Entry point`),
  ]),
  purpose: enum_(PurposeOfEntry, 'Please select a valid Purpose of Entry'),
  travelling_by: object({
    type: enum_(travellingByType, 'Please select an option.'),
    no: string('No must be a string.', [
      minLength(1, 'Please enter No.'),
      maxLength(255, 'Please enter No with a maximum length of characters.'),
    ]),
  }),
  country_id: string('travelling from must be a string.', [
    minLength(1, 'Please select an option.'),
  ]),
  is_travelling_in_tour: optional(
    string('Group tour must be a string.', [
      maxLength(
        255,
        'Please enter Group tour with a maximum length of 255 characters.',
      ),
    ]),
  ),
  check_in_date: string('Check in date must be a string.', [
    minLength(1, 'Please enter Check in date.'),
    regex(/^\d{4}-\d{2}-\d{2}$/, 'Check in date must be in YYYY-MM-DD format.'),
  ]),

  arrival_registration_type: enum_(
    ArrivalRegistration,
    'Please select a valid Arrival Registration Type',
  ),

  personal_info: PersonalInfoSchema,
  passport_info: PassportInfoSchema,
  visa: VisaInfoSchema,
  intend_Address: IntendedAddressSchema,
});

// test
type ArrivalRegistrationDtoType = Output<typeof ArrivalRegistrationDto>;

export { ArrivalRegistrationDto, ArrivalRegistrationDtoType };
