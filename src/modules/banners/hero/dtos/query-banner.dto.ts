import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, string } from 'valibot';

const QueryBannerDto = merge([
  OffsetBasePaginateDto,
  object({
    is_inactive: optional(string()),
    is_private: optional(string()),
  }),
]);

type QueryBannerType = Output<typeof QueryBannerDto>;

export { QueryBannerDto, type QueryBannerType };
