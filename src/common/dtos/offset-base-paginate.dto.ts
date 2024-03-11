import { Output, object, optional, string, transform } from 'valibot';

const OffsetBasePaginateDto = object({
  offset: optional(
    transform(string(), (input) => {
      if (input) return Number(input);
    }),
  ),
  limit: optional(
    transform(string(), (input) => {
      if (input) return Number(input);
    }),
  ),
});

type OffsetBasePaginateDtoType = Output<typeof OffsetBasePaginateDto>;

export { OffsetBasePaginateDto, type OffsetBasePaginateDtoType };
