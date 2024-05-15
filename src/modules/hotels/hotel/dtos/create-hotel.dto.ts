import { MemoryStoredFile } from 'nestjs-form-data';
import {
  CreateUserDto,
  CreateUserDtoType,
} from 'src/modules/users/users/dtos/create-user.dto';
import {
  OptionalSchema,
  Output,
  StringSchema,
  custom,
  maxLength,
  minLength,
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
  HotelTranslateDto,
  HotelTranslateDtoType,
} from './hotel-translate.dto';

const CreateHotelDto = object({
  image: special(
    (input) => input instanceof MemoryStoredFile,
    'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    [
      custom(
        (input: MemoryStoredFile) =>
          ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
        'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
      ),
    ],
  ),

  phone_number: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(6, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 6 ຕົວເລກ.'),
    maxLength(50, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 50 ຕົວເລກ.'),
  ]),

  link: string('ຈະຕ້ອງເປັນ string.'),

  is_published: transform(
    string('ຈະຕ້ອງເປັນ string', [regex(/^[0-9]+$/, 'ຄວນເປັນໂຕເລກ: 0-9.')]),
    (input) => Boolean(Number(input)),
  ),

  lo: transform<StringSchema<string>, Omit<HotelTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(HotelTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  en: transform<StringSchema<string>, Omit<HotelTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(HotelTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  zh_cn: transform<StringSchema<string>, Omit<HotelTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(HotelTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  user: transform<
    OptionalSchema<StringSchema<string>>,
    Omit<CreateUserDtoType, 'image' | 'role_ids' | 'first_name' | 'last_name'>
  >(optional(string()), (input) => (input ? JSON.parse(input) : undefined), [
    custom((input) =>
      input
        ? safeParse(
            omit(CreateUserDto, [
              'image',
              'role_ids',
              'first_name',
              'last_name',
            ]),
            input,
          ).success
        : true,
    ),
  ]),
});

type CreateHotelDtoType = Output<typeof CreateHotelDto>;

export { CreateHotelDto, type CreateHotelDtoType };
