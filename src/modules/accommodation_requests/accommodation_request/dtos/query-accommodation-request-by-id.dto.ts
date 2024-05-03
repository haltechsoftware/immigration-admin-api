import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryAccommodationRequestByIdDto = partial(LanguageDto);

export type QueryAccommodationRequestByIdDtoType = Output<
  typeof QueryAccommodationRequestByIdDto
>;
