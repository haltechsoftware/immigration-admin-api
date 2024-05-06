import { isBefore } from 'date-fns';
import { custom, maxLength, minLength, object, Output, string } from 'valibot';

const GuestsCheckInDto = object(
  {
    verify_code: string([minLength(1), maxLength(10)]),
    room_no: string(),
    check_in: string([
      minLength(1),
      custom((input) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input)),
    ]),
    check_out: string([
      minLength(1),
      custom((input) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input)),
    ]),
  },
  [custom(({ check_in, check_out }) => isBefore(check_in, check_out))],
);

type GuestsCheckInDtoType = Output<typeof GuestsCheckInDto>;

export { GuestsCheckInDto, type GuestsCheckInDtoType };
