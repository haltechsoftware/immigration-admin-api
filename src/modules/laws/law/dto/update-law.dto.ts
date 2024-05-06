import { MemoryStoredFile } from 'nestjs-form-data';
import {
  merge,
  Output,
  object,
  optional,
  string,
  special,
  custom,
  omit,
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
            'โปรดเลือกไฟล์ PDF.',
          ),
          custom(
            (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 2,
            'โปรดเลือกไฟล์ที่มีขนาดไม่เกิน 2 MB.',
          ),
        ],
      ),
    ),

    name: optional(string('ต้องเป็นข้อความ.')),
  }),
]);

type UpdateLawDtoType = Output<typeof UpdateLawDto>;

export { UpdateLawDto, type UpdateLawDtoType };
