import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import {
  literal,
  merge,
  object,
  optional,
  Output,
  partial,
  string,
  transform,
  union,
} from 'valibot';

export const QueryClientNewsDto = merge([
  OffsetBasePaginateDto,
  partial(LanguageDto),
]);

export type QueryClientNewsDtoType = Output<typeof QueryClientNewsDto>;
