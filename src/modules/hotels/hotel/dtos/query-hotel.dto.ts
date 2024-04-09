import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, string } from 'valibot';

const QueryHotelDto = merge([
  OffsetBasePaginateDto,
  object({
    is_published: optional(string()),
  }),
]);

type QueryHotelType = Output<typeof QueryHotelDto>;

export { QueryHotelDto, type QueryHotelType };
