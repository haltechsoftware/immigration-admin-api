import { MemoryStoredFile } from 'nestjs-form-data';
import { custom, object, Output, special } from 'valibot';

export const UploadFeedbackMediaDto = object({
  media: special(
    (input) => input instanceof MemoryStoredFile,
    'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    [
      custom(
        (input: MemoryStoredFile) =>
          ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'].includes(
            input.mimeType,
          ),
        'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 5,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 5 MB.',
      ),
    ],
  ),
});

export type UploadFeedbackMediaDtoType = Output<typeof UploadFeedbackMediaDto>;
