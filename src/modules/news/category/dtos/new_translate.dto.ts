import { maxLength, minLength, number, object, string } from 'valibot';

export const NewTranslateDto = object({
  id: number('ຈະຕ້ອງເປັນ number'),
  name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
});
