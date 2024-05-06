import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryProvinceByIdDto = partial(LanguageDto);

export type QueryProvinceByIdDtoType = Output<
  typeof QueryProvinceByIdDto
>;
