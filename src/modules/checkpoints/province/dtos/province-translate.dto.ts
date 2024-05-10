import { minLength, number, object, string } from 'valibot';

export const ProvinceTranslateDto = object({
  id: number('ຈະຕ້ອງເປັນ number'),
  name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')]),
});
