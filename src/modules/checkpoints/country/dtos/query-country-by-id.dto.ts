import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryCountryByIdDto = partial(LanguageDto);

export type QueryCountryByIdDtoType = Output<
  typeof QueryCountryByIdDto
>;
