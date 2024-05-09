import { maxLength, minLength, number, object, Output, string } from 'valibot';

export const HotelTranslateDto = object({
  id: number(),
  name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  province: string('ຈະຕ້ອງເປັນ string.', [maxLength(255)]),
  district: string('ຈະຕ້ອງເປັນ string.', [maxLength(255)]),
  village: string('ຈະຕ້ອງເປັນ string.', [maxLength(255)]),
});

export type HotelTranslateDtoType = Output<typeof HotelTranslateDto>;
