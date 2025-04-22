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

export const QueryPointClientDto = merge([
  OffsetBasePaginateDto,
  partial(LanguageDto),
]);

export type QueryPointClientDtoType = Output<typeof QueryPointClientDto>;
