import { object, optional, Output, special } from 'valibot';

export const QueryAccommodationRequestByIdDto = object({
  lang: optional(
    special<'lo' | 'en' | 'zh_cn' | undefined>(
      (input) => input === 'lo' || input === 'en' || input === 'zh_cn',
      'ລະຫັດພາສາບໍ່ຖືກຕ້ອງ',
    ),
  ),
});

export type QueryAccommodationRequestByIdDtoType = Output<
  typeof QueryAccommodationRequestByIdDto
>;
