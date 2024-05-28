import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryLostPassportByIdDto = partial(LanguageDto);

export type QueryLostPassportByIdDtoType = Output<
  typeof QueryLostPassportByIdDto
>;
