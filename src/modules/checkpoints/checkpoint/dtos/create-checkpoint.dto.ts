import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  StringSchema,
  custom,
  maxLength,
  minLength,
  object,
  omit,
  optional,
  safeParse,
  special,
  string,
  transform,
} from 'valibot';
import {
  CheckpointTranslateDto,
  CheckpointTranslateDtoType,
} from './checkpoint-translate.dto';

const CreateCheckpointDto = object({
  category_id: transform(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ'), (input) => Number(input)),
  province_id: transform(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ'), (input) => Number(input)),
  country: optional(string()),
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
  link_map: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
  ]),
  phone_number: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    maxLength(20, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),
  email: string(),
  visa: transform(string(), (input) => (input === 'true' ? true : false)),
  e_visa: transform(string(), (input) => (input === 'true' ? true : false)),

  lo: transform<StringSchema<string>, Omit<CheckpointTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) =>
          safeParse(omit(CheckpointTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  en: transform<StringSchema<string>, Omit<CheckpointTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) =>
          safeParse(omit(CheckpointTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  zh_cn: transform<
    StringSchema<string>,
    Omit<CheckpointTranslateDtoType, 'id'>
  >(string(), (input) => JSON.parse(input), [
    custom(
      (input) => safeParse(omit(CheckpointTranslateDto, ['id']), input).success,
    ),
  ]),
});

type CreateCheckpointDtoType = Output<typeof CreateCheckpointDto>;

export { CreateCheckpointDto, CreateCheckpointDtoType };
