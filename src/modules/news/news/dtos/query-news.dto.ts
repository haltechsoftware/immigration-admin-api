import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import {
  literal,
  merge,
  object,
  optional,
  Output,
  string,
  transform,
  union,
} from 'valibot';

export const QueryNewsDto = merge([
  OffsetBasePaginateDto,
  object({
    category_id: optional(transform(string(), (input) => Number(input))),
    status: optional(
      union([literal('draft'), literal('published'), literal('private')]),
    ),
  }),
]);

export type QueryNewsDtoType = Output<typeof QueryNewsDto>;
