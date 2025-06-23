import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  custom,
  maxLength,
  minLength,
  nullable,
  object,
  optional,
  regex,
  special,
  string,
  transform,
} from 'valibot';

const CreateBannerHeroDto = object({
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

  link: string('ຈະຕ້ອງເປັນ string.'),

  start_time: string('ຈະຕ້ອງເປັນ string', [
    regex(
      /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
      'ຮູບແບບວັນທີບໍ່ຖືກຕ້ອງ. ກະລຸນາໃຊ້ຮູບແບບຕໍ່ໄປນີ້: mm-dd-yyyy.',
    ),
  ]),

  end_time: string('ຈະຕ້ອງເປັນ string', [
    regex(
      /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
      'ຮູບແບບວັນທີບໍ່ຖືກຕ້ອງ. ກະລຸນາໃຊ້ຮູບແບບຕໍ່ໄປນີ້: mm-dd-yyyy.',
    ),
  ]),

  is_private: transform(
    string('ຈະຕ້ອງເປັນ string', [regex(/^[0-9]+$/, 'ຄວນເປັນໂຕເລກ: 0-9.')]),
    (input) => Boolean(Number(input)),
  ),

  lo_title: optional(
    nullable(
      string('ຈະຕ້ອງເປັນ string', [
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    ),
  ),
  lo_description: optional(
    nullable(
      string('ຈະຕ້ອງເປັນ string.', [
        maxLength(1000, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 1000 ຕົວອັກສອນ.'),
      ]),
    ),
  ),
  en_title: optional(
    nullable(
      string('ຈະຕ້ອງເປັນ string.', [
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    ),
  ),
  en_description: optional(
    nullable(
      string('ຈະຕ້ອງເປັນ string.', [
        maxLength(1000, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 1000 ຕົວອັກສອນ.'),
      ]),
    ),
  ),
  zh_cn_title: optional(
    nullable(
      string('ຈະຕ້ອງເປັນ string.', [
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
      ]),
    ),
  ),
  zh_cn_description: optional(
    nullable(
      string('ຈະຕ້ອງເປັນ string.', [
        maxLength(1000, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 1000 ຕົວອັກສອນ.'),
      ]),
    ),
  ),
});

type CreateBannerHeroType = Output<typeof CreateBannerHeroDto>;

export { CreateBannerHeroDto, CreateBannerHeroType };
