import { MemoryStoredFile } from 'nestjs-form-data';
import { Output, custom, minLength, object, special, string } from 'valibot';

const CreateLawDto = object({
  file: special(
    (input) => input instanceof MemoryStoredFile,
    'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    [
      custom(
        (input: MemoryStoredFile) =>
          ['application/pdf'].includes(input.mimeType),
        'ກະລຸນາເລືອກໄຟລ໌ PDF.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 100,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 100 MB.',
      ),
    ],
  ),

  name: string('ຈະຕ້ອງເປັນ string.', [minLength(1, 'ກະລຸນາໃສ່ຊື່ກົດລະບຽບ')]),
});

type CreateLawDtoType = Output<typeof CreateLawDto>;
export { CreateLawDto, CreateLawDtoType };
