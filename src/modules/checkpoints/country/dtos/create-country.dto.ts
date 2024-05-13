import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  StringSchema,
  custom,
  object,
  omit,
  optional,
  regex,
  safeParse,
  special,
  string,
  transform,
} from 'valibot';
import {
  CountryTranslateDto,
  CountryTranslateDtoType,
} from './country-translate.dto';

const CreateCountryDto = object({
  image: optional(
    special((input) => input instanceof MemoryStoredFile, 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ', [
      custom(
        (input: MemoryStoredFile) =>
          ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
        'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
      ),
    ]),
  ),

  is_except_visa: transform(
    string('ຈະຕ້ອງເປັນ string', [regex(/^[0-9]+$/, 'ຄວນເປັນໂຕເລກ: 0-9.')]),
    (input) => Boolean(Number(input)),
  ),

  lo: transform<StringSchema<string>, Omit<CountryTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(CountryTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  en: transform<StringSchema<string>, Omit<CountryTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(CountryTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  zh_cn: transform<StringSchema<string>, Omit<CountryTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(CountryTranslateDto, ['id']), input).success,
      ),
    ],
  ),
});

type CreateCountryDtoType = Output<typeof CreateCountryDto>;

export { CreateCountryDto, CreateCountryDtoType };
