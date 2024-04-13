import { CursorBasePaginateDto } from 'src/common/dtos/cursor-base-paginate.dto';
import { merge, object, optional, Output, special } from 'valibot';

export const QueryAccommodationRequestDto = merge([
  CursorBasePaginateDto,
  object({
    lang: optional(
      special<'lo' | 'en' | 'zh_cn'>(
        (input) => input === 'lo' || input === 'en' || input === 'zh_cn',
        'ລະຫັດພາສາບໍ່ຖືກຕ້ອງ',
      ),
    ),
  }),
]);

export type QueryAccommodationRequestDtoType = Output<
  typeof QueryAccommodationRequestDto
>;
