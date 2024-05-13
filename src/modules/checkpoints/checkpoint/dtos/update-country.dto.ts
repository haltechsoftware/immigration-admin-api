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
import {
  CheckpointTranslateDto,
  CheckpointTranslateDtoType,
} from './checkpoint-translate.dto';
import { CreateCheckpointDto } from './create-checkpoint.dto';

const UpdateCheckpointDto = merge([
  omit(CreateCheckpointDto, ['lo', 'en', 'zh_cn', 'image']),
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
    lo: transform<StringSchema<string>, CheckpointTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(CheckpointTranslateDto, input).success)],
    ),
    en: transform<StringSchema<string>, CheckpointTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(CheckpointTranslateDto, input).success)],
    ),
    zh_cn: transform<StringSchema<string>, CheckpointTranslateDtoType>(
      string(),
      (input) => JSON.parse(input),
      [custom((input) => safeParse(CheckpointTranslateDto, input).success)],
    ),
  }),
]);

type UpdateCheckpointDtoType = Output<typeof UpdateCheckpointDto>;

export { UpdateCheckpointDto, UpdateCheckpointDtoType };
