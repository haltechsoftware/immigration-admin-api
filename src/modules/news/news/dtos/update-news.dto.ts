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
import { CreateNewsDto } from './create-news.dto';
import { NewsTranslateDto, NewsTranslateDtoType } from './news-translate.dto';
const UpdateNewsDto = merge([
  omit(CreateNewsDto, ['lo', 'en', 'zh_cn', 'thumbnail']),
  object({
    thumbnail: optional(
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

    lo: transform<StringSchema<string>, NewsTranslateDtoType>(
      string(),
      (input) => {
        const res = safeParse(NewsTranslateDto, JSON.parse(input));
        if (res.success) {
          return res.output;
        }
      },
      [custom((input) => safeParse(NewsTranslateDto, input).success)],
    ),

    en: transform<StringSchema<string>, NewsTranslateDtoType>(
      string(),
      (input) => {
        const res = safeParse(NewsTranslateDto, JSON.parse(input));
        if (res.success) {
          return res.output;
        }
      },
      [custom((input) => safeParse(NewsTranslateDto, input).success)],
    ),

    zh_cn: transform<StringSchema<string>, NewsTranslateDtoType>(
      string(),
      (input) => {
        const res = safeParse(NewsTranslateDto, JSON.parse(input));
        if (res.success) {
          return res.output;
        }
      },
      [custom((input) => safeParse(NewsTranslateDto, input).success)],
    ),
  }),
]);

type UpdateNewsDtoType = Output<typeof UpdateNewsDto>;

export { UpdateNewsDto, UpdateNewsDtoType };
