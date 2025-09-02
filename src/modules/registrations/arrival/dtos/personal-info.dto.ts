import englishOnly from 'src/common/utils/english-only';
import { object, string, minLength, maxLength, enum_ } from 'valibot';
export enum Gender {
  Male = 'male',
  Female = 'female',
}

export const PersonalInfoSchema = object({
  family_name: string('family name must be a string.', [
    minLength(1, 'Please enter family name.'),
    maxLength(
      255,
      'Please enter family name with a maximum length of 255 characters.',
    ),
    // englishOnly('family name'),
  ]),
  name: string('Name must be a string.', [
    minLength(1, 'Please enter family name.'),
    maxLength(
      255,
      'Please enter family name with a maximum length of 255 characters.',
    ),
    // englishOnly('family name'),
  ]),
  gender: enum_(Gender, 'Please select a valid gender.'),
  date_of_birth: string('Date of Birth must be a string.', [
    minLength(1, 'Please enter Date of Birth'),
  ]),
  place_of_birth: string('Place of birth must be a string.', [
    minLength(1, 'Please enter Place of birth.'),
    maxLength(
      255,
      'Please enter Place of birth with a maximum length of 255 characters.',
    ),
  ]),
  nationality: string('Nationality must be a string', [
    minLength(1, 'Please enter Nationality.'),
    maxLength(
      255,
      'Please enter Nationality with a maximum length of 255 characters.',
    ),
    // englishOnly('Nationality'),
  ]),
  occupation: string('Occupation must be a string', [
    minLength(1, 'Please enter Occupation.'),
    maxLength(
      255,
      'Please enter Occupation with a maximum length of 255 characters.',
    ),
    // englishOnly('Occupation'),
  ]),
  race: string('race must be a string', [
    minLength(1, 'Please enter race.'),
    maxLength(
      255,
      'Please enter race with a maximum length of 255 characters.',
    ),
    // englishOnly('race'),
  ]),
  // phone_number: string('Phone number must be a string', [
  //     minLength(6, "Please enter Phone number."),
  //     maxLength(20, "Please enter Phone number with a maximum length of 20 characters."),
  //     englishOnly("Phone number"),
  // ])
  phone_number: string('Phone number must be a string', [
    minLength(6, 'Phone number must be at least 6 characters.'),
    maxLength(20, 'Phone number must not exceed 20 characters.'),
    // englishOnly("Phone number must contain only English characters."),
  ]),
});
