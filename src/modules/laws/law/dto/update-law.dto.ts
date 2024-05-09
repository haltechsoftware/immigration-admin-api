import { MemoryStoredFile } from 'nestjs-form-data';
import {
  custom,
  merge,
  object,
  omit,
  optional,
  Output,
  special,
} from 'valibot';
import { CreateLawDto } from './create-law.dto';

const UpdateLawDto = merge([
  omit(CreateLawDto, ['file']),
  object({
    file: optional(
      special(
        (input) => input instanceof MemoryStoredFile,
        'ข้อมูลไม่ถูกต้อง',
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
    ),
  }),
]);

type UpdateLawDtoType = Output<typeof UpdateLawDto>;

export { UpdateLawDto, type UpdateLawDtoType };
