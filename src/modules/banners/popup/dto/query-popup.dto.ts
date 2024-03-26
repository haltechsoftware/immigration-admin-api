import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, string } from 'valibot';

const QueryPopupDto = merge([
  OffsetBasePaginateDto,
  object({
    is_inactive: optional(string()),
    is_private: optional(string()),
  }),
]);

type QueryPopupDtoType = Output<typeof QueryPopupDto>;

export { QueryPopupDto, type QueryPopupDtoType };
