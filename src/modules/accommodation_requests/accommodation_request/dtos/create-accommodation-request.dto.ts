import { Output, object, omit } from 'valibot';
import { AccommodationRequestTranslateSchema } from './accommodation-request-translate.schema';

const CreateAccommodationRequestDto = object({
  lo: omit(AccommodationRequestTranslateSchema, ['id']),
  en: omit(AccommodationRequestTranslateSchema, ['id']),
  zh_cn: omit(AccommodationRequestTranslateSchema, ['id']),
});

type CreateAccommodationRequestDtoType = Output<
  typeof CreateAccommodationRequestDto
>;

export { CreateAccommodationRequestDto, CreateAccommodationRequestDtoType };
