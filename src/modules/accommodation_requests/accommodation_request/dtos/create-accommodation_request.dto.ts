import { Output, maxLength, minLength, object, string } from 'valibot';

const CreateAccommodationRequestDto = object({
  lo_title: string('ຈະຕ້ອງເປັນ string', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  lo_content: string('ຈະຕ້ອງເປັນ string.', [
    minLength(4, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
  ]),
  en_title: string('ຈະຕ້ອງເປັນ string.', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  en_content: string('ຈະຕ້ອງເປັນ string.', [
    minLength(4, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
  ]),
  zh_cn_title: string('ຈະຕ້ອງເປັນ string.', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  zh_cn_content: string('ຈະຕ້ອງເປັນ string.', [
    minLength(4, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
  ]),
});

type CreateAccommodationRequestDtoType = Output<
  typeof CreateAccommodationRequestDto
>;

export { CreateAccommodationRequestDto, CreateAccommodationRequestDtoType };
