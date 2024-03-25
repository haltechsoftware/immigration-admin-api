import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  boolean,
  custom,
  maxLength,
  minLength,
  object,
  optional,
  regex,
  special,
  string,
  transform,
} from 'valibot';
import { IsDateTime, isNotEmpty, isToday, isValidUrl } from '../utils/validation.util';

const CreatePopupDto = object({
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
  
  link: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    custom((input: string) => isNotEmpty(input), 'ລິ້ງບໍ່ສາມາດເປັນວ່າງ'),
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    custom(
      (input: string) => isValidUrl(input),
      'ລິ້ງຄວນເປັນ http:// and https://',
    ),
  ]),

  is_private: transform(string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ', [regex(/^[0-9]+$/, "ຄວນເປັນໂຕເລກ: 0-9.")]), (input) => Boolean(Number(input))),

  start_time: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    custom((input: string) => isNotEmpty(input), 'ບໍ່ສາມາດເປັນວ່າງ:'),
    custom((input) => IsDateTime.test(input), 'ຄວນເປັນ: yyyy-MM-dd HH:mm:ss.SSS.'),
    custom((input: string) => {
      const today = new Date().toISOString().slice(0, 10); // Adjusted to Y-M-D format
      return input.startsWith(today);
    }, `ຄວນເປັນມື້ປັດຈຸບັນ: ${new Date().toISOString().slice(0, 10)}`),
  ]),

  end_time: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    custom((input: string) => isNotEmpty(input), 'ບໍ່ສາມາດເປັນວ່າງ'),
    custom((input) => IsDateTime.test(input), 'ຄວນເປັນ: yyyy-MM-dd HH:mm:ss.SSS.'),
  ]),
});

type CreatePopupDtoType = Output<typeof CreatePopupDto>;

export { CreatePopupDto, type CreatePopupDtoType };
