import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { object, merge, optional, string, special, Output } from 'valibot';

const QueryDepartureDto = merge([
  OffsetBasePaginateDto,
  object({
    personal_information: optional(string()),
    passport_number: optional(string()),
    verified_at: optional(string()),
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
