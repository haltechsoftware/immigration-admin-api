import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  StringSchema,
  custom,
  merge,
  object,
  omit,
  optional,
  safeParse,
  special,
  string,
  transform,
} from 'valibot';
import { CreateHotelDto } from './create-hotel.dto';
import {
  HotelTranslateDto,
  HotelTranslateDtoType,
} from './hotel-translate.dto';

const UpdateHotelDto = merge([
  omit(CreateHotelDto, ['image', 'lo', 'en', 'zh_cn']),
  object({
    image: optional(
      special(
        (input) => input instanceof MemoryStoredFile,
        'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
        [
          custom(
            (input: MemoryStoredFile) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(
                input.mimeType,
              ),
            'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
          ),
          custom(
            (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
            'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
          ),
        ],
      ),
    ),
    lo: transform<StringSchema<string>, HotelTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(HotelTranslateDto, input).success)],
    ),
    en: transform<StringSchema<string>, HotelTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(HotelTranslateDto, input).success)],
    ),
    zh_cn: transform<StringSchema<string>, HotelTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(HotelTranslateDto, input).success)],
    ),
  }),
]);

type UpdateHotelDtoType = Output<typeof UpdateHotelDto>;
export { UpdateHotelDto, type UpdateHotelDtoType };
