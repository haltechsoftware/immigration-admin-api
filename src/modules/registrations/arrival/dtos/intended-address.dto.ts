import { isBefore } from 'date-fns';
import {
  custom,
  maxLength,
  nullable,
  object,
  optional,
  string,
  tuple,
} from 'valibot';

export const IntendedAddressSchema = object({
  name: optional(
    string('Accommodation Name / Hotel Name must be a string.', [
      // minLength(1, 'Please enter Accommodation Name / Hotel Name.'),
      maxLength(
        255,
        'Please enter Accommodation Name / Hotel Name with a maximum length of 255 characters.',
      ),
      // englishOnly('Accommodation Name / Hotel Name'),
    ]),
  ),
  province: optional(
    string('Province must be a string.', [
      // minLength(1, 'Please enter Province.'),
      maxLength(
        255,
        'Please enter Province with a maximum length of 255 characters.',
      ),
      // englishOnly('Province'),
    ]),
  ),
  district: optional(
    string('District must be a string.', [
      // minLength(1, 'Please enter District.'),
      maxLength(
        255,
        'Please enter District with a maximum length of 255 characters.',
      ),
      // englishOnly('District'),
    ]),
  ),
  village: optional(
    string('Village must be a string.', [
      // minLength(1, 'Please enter Village.'),
      maxLength(
        255,
        'Please enter Village with a maximum length of 255 characters.',
      ),
      // englishOnly('Village'),
    ]),
  ),
  date_range: tuple(
    [
      optional(nullable(string())), // checkIn: string | null | undefined
      optional(nullable(string())), // checkOut: string | null | undefined
    ],
    // [
    //   custom(
    //     ([checkIn, checkOut]) =>
    //       isBefore(new Date(checkIn), new Date(checkOut)),
    //     'Check-in must be before check-out.',
    //   ),
    // ],
  ),
});
