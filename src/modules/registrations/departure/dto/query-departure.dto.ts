import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { merge, object, optional, Output, special, string } from 'valibot';

const QueryDepartureDto = merge([
  OffsetBasePaginateDto,
  object({
    departure_name: optional(string()),
    passport_number: optional(string()),
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
          input === 'available' ||
          input === 'unavailable' ||
          input === '' ||
          input === undefined,
        'Invalid type: Expected available or unavailable',
      ),
    ),
    verification_code: optional(string()),
  }),
]);

type QueryDepartureDtoType = Output<typeof QueryDepartureDto>;

export { QueryDepartureDto, type QueryDepartureDtoType };
