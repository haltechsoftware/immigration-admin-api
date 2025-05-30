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
    slug: optional(transform(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ'), (input) => String(input))),
  }),
]);

export type QueryNewsClientDtoType = Output<typeof QueryNewsClientDto>;
