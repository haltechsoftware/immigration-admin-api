import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { object, merge, Output, optional, string, special } from 'valibot';

const QueryArrivalDto = merge([
  OffsetBasePaginateDto,
  object({
    entry_name: optional(string()),
    passport_number: optional(string()),
    visa_number: optional(string()),
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

type QueryArrivalDtoType = Output<typeof QueryArrivalDto>;

export { QueryArrivalDto, type QueryArrivalDtoType };
