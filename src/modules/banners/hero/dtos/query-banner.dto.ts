import { Output, object, optional, string } from 'valibot';

const QueryBannerDto = object({
  is_inactive: optional(string()),
  is_private: optional(string()),
});

type QueryBannerType = Output<typeof QueryBannerDto>;

export { QueryBannerDto, type QueryBannerType };
