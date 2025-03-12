import { MemoryStoredFile } from "nestjs-form-data";
import { custom, maxLength, minLength, object, special, string } from "valibot";

export const VisaInfoSchema = object({
  visaCategory: string('Visa must be a string.', [
      minLength(1, 'Please enter Visa.'),
      maxLength(
        255,
        'Please enter Visa with a maximum length of ${255} characters.',
      ),
  ]),
  no: string('Visa No must be a string.', [
      minLength(1, 'Please enter Visa No.'),
  ]),
  date_of_issue: string('Date of issue must be a string.', [
      minLength(
        1,
        'Please enter Date of issue',
      ),
  ]),
  place_of_issue: string('Place of issue must be a string.', [
        minLength(
          1,
          'Please enter Place of issue ',
        ),
        maxLength(
          255,
          'Please enter Place of issue with a maximum length of 255 characters.',
        ),
    ]),
    image: string('image must be a string'),
//   image: special(
//     (input) => input instanceof MemoryStoredFile,
//     'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
//     [
//       custom(
//         (input: MemoryStoredFile) =>
//           ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
//         'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
//       ),
//       custom(
//         (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
//         'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
//       ),
//     ],
//   ),
});