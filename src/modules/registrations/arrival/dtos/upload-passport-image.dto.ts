import { MemoryStoredFile } from 'nestjs-form-data';
import { custom, object, special, string } from 'valibot';

export const UploadPassportImageDto = object({
  image: special(
    (input) => input instanceof MemoryStoredFile,
    'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    [
      custom(
        (input: MemoryStoredFile) =>
          ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
            input.mimeType,
          ),
        'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
      ),
      custom(
        (input: MemoryStoredFile) => !/^['"].*['"]$/.test(input.originalName),
        'ຊື່ໄຟລ໌ບໍ່ຖືກຕ້ອງ: ບໍ່ຄວນມີ \' ຫຼື " ຢູ່ດ້ານໜ້າ, ໃຊ້ອັກສອນ, ຕົວເລກ, _, - ແລະ . ເທົ່ານັ້ນ.',
      ),
    ],
  ),
  passport_number: string(),
});
