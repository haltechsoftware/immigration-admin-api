import { minLength, number, object, string } from 'valibot';

export const CheckpointTranslateDto = object({
  id: number('ຈະຕ້ອງເປັນ number'),
  title: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')]),
  description: string('ຈະຕ້ອງເປັນ string'),
});
