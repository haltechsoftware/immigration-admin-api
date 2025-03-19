import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, partial, string } from 'valibot';

const QueryClientCountryDto = merge([
  OffsetBasePaginateDto,
  partial(LanguageDto),
]);

type QueryClientCountryDtoType = Output<typeof QueryClientCountryDto>;

export { QueryClientCountryDto, QueryClientCountryDtoType };
