import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { merge, Output, partial } from 'valibot';

export const QueryNationality = merge([
  OffsetBasePaginateDto,
  partial(LanguageDto),
]);

export type QueryNationalityType = Output<typeof QueryNationality>;
