import { CursorBasePaginateDto } from 'src/common/dtos/cursor-base-paginate.dto';
import { LanguageDto } from 'src/common/dtos/language.dto';
import { merge, Output, partial } from 'valibot';

export const QueryVisaCategory = merge([
  CursorBasePaginateDto,
  partial(LanguageDto),
]);

export type QueryVisaCategoryType = Output<typeof QueryVisaCategory>;
