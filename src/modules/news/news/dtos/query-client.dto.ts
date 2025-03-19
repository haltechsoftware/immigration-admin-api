import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import {
  merge,
  object,
  optional,
  Output,
  partial,
  string,
  transform,
} from 'valibot';

export const QueryNewsClientDto = merge([
  OffsetBasePaginateDto,
  partial(LanguageDto),
  object({
    category_id: optional(transform(string(), (input) => Number(input))),
  }),
]);

export type QueryNewsClientDtoType = Output<typeof QueryNewsClientDto>;
