import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { merge, Output, partial } from 'valibot';

export const QueryServiceDto = merge([
  OffsetBasePaginateDto,
  partial(LanguageDto),
]);

export type QueryServiceDtoType = Output<typeof QueryServiceDto>;
