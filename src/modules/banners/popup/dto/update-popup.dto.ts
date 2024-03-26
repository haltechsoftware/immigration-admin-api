import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  custom,
  merge,
  object,
  omit,
  optional,
  special,
} from 'valibot';
import { CreatePopupDto } from './create-popup.dto';

const UpdatePopupDto = merge([
  omit(CreatePopupDto, ['image']),
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
  }),
]);

type UpdatePopupDtoType = Output<typeof UpdatePopupDto>;

export { UpdatePopupDto, type UpdatePopupDtoType };
