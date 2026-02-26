import { Output, maxLength, minLength, object, string } from 'valibot';

export const VerifyDepartureCodeDto = object({
  verification_code: string('ຕ້ອງເປັນ string', [
    minLength(1, 'ຕ້ອງບໍ່ວ່າງເປົ່າ'),
    maxLength(20, 'ຕົວອັກສອນຕ້ອງບໍ່ເກີນ 20'),
  ]),
});

export type VerifyDepartureCodeDtoType = Output<typeof VerifyDepartureCodeDto>;
