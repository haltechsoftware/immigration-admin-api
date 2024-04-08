import { Output, merge, object, string, transform } from 'valibot';
import { CreateAccommodationRequestDto } from './create-accommodation_request.dto';

const UpdateAccommodationRequestDto = merge([
  CreateAccommodationRequestDto,
  object({
    lo_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    en_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    zh_cn_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
  }),
]);

type UpdateAccommodationRequestDtoType = Output<
  typeof UpdateAccommodationRequestDto
>;

export { UpdateAccommodationRequestDto, UpdateAccommodationRequestDtoType };
