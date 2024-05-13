import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  StringSchema,
  custom,
  enum_,
  object,
  omit,
  optional,
  safeParse,
  special,
  string,
  transform,
} from 'valibot';
import { NewsTranslateDto, NewsTranslateDtoType } from './news-translate.dto';

enum NewsStatus {
  Draft = 'draft',
  Public = 'published',
  Private = 'private',
}
const CreateNewsDto = object({
  category_id: transform(optional(string('ຈະຕ້ອງເປັນ string')), (input) =>
    input ? Number(input) : undefined,
  ),
  thumbnail: special(
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
  status: enum_(
    NewsStatus,
    'ຕ້ອງເປັນ draft ຫຼື published ແລະ private ເທົ່ານັ້ນ',
  ),

  lo: transform<StringSchema<string>, Omit<NewsTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(NewsTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  en: transform<StringSchema<string>, Omit<NewsTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(NewsTranslateDto, ['id']), input).success,
      ),
    ],
  ),

  zh_cn: transform<StringSchema<string>, Omit<NewsTranslateDtoType, 'id'>>(
    string(),
    (input) => JSON.parse(input),
    [
      custom(
        (input) => safeParse(omit(NewsTranslateDto, ['id']), input).success,
      ),
    ],
  ),
});

type CreateNewsDtoType = Output<typeof CreateNewsDto>;

export { CreateNewsDto, CreateNewsDtoType, NewsStatus };
