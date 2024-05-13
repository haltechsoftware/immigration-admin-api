import { minLength, number, object, Output, string } from 'valibot';

export const CountryTranslateDto = object({
  id: number(),
  name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')]),
  description: string('ຈະຕ້ອງເປັນ string'),
});

export type CountryTranslateDtoType = Output<typeof CountryTranslateDto>;
