import { Output, object } from 'valibot';
import { AccommodationRequestTranslateSchema } from './accommodation-request-translate.schema';

const UpdateAccommodationRequestDto = object({
  lo: AccommodationRequestTranslateSchema,
  en: AccommodationRequestTranslateSchema,
  zh_cn: AccommodationRequestTranslateSchema,
});

type UpdateAccommodationRequestDtoType = Output<
  typeof UpdateAccommodationRequestDto
>;

export { UpdateAccommodationRequestDto, UpdateAccommodationRequestDtoType };
