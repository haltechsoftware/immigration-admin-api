import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, string } from 'valibot';

const QueryCountryDto = merge([
  OffsetBasePaginateDto,
  object({
    is_except_visa: optional(string()),
  }),
]);

type QueryCountryDtoType = Output<typeof QueryCountryDto>;

export { QueryCountryDto, QueryCountryDtoType };
