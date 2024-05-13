import { maxLength, minLength, number, object, Output, string } from 'valibot';

export const CheckpointTranslateDto = object({
  id: number(),
  name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')]),
  content: string('ຈະຕ້ອງເປັນ string'),
  address: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),
});

export type CheckpointTranslateDtoType = Output<typeof CheckpointTranslateDto>;
