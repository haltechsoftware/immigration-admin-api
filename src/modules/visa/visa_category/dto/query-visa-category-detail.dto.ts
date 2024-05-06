import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryVisaCategoryDetailDto = partial(LanguageDto);

export type QueryVisaCategoryDetailDtoType = Output<
  typeof QueryVisaCategoryDetailDto
>;
