import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { merge, object, optional, Output, special, string } from 'valibot';

const queryReportArrivalDto = merge([
  OffsetBasePaginateDto,
  object({
    entry_name: optional(string()),
    passport_number: optional(string()),
    visa_number: optional(string()),
    is_verified: optional(
      special<'verified' | 'no_verified'>(
        (input) =>
          input === 'verified' || input === 'no_verified' || input === '',
        'Invalid type: Expected verified or no_verified',
      ),
    ),
    black_list: optional(
      special<'available' | 'unavailable'>(
        (input) =>
          input === 'available' || input === 'unavailable' || input === '',
        'Invalid type: Expected available or unavailable',
      ),
    ),
    verification_code: optional(string()),

    start_date: optional(
      special<string>(
        (input) => (!input ? true : !isNaN(Date.parse(input as string))), // allow undefined/null แต่ไม่ allow ''
        'Invalid start_date: must be a valid date string',
      ),
    ),
    end_date: optional(
      special<string>(
        (input) => (!input ? true : !isNaN(Date.parse(input as string))),
        'Invalid end_date: must be a valid date string',
      ),
    ),
  }),
]);

type QueryReportArrivalDtoType = Output<typeof queryReportArrivalDto>;

export { queryReportArrivalDto, type QueryReportArrivalDtoType };
