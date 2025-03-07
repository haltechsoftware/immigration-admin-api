
import { MemoryStoredFile } from 'nestjs-form-data';
import {
    Output,
    email,
    maxLength,
    minLength,
    object,
    optional,
    special,
    string,
    transform,
  } from 'valibot';

const CreateFeedbackDto = object({
  fullName: string('ຕ້ອງເປັນສະຕຣິງ.', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  tel: string('ຕ້ອງເປັນສະຕຣິງ', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 6 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 20 ຕົວອັກສອນ.'),
  ]),
  email: string('ຕ້ອງເປັນສະຕຣິງ', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    email('ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ.'),
  ]),
  message: string('ຕ້ອງເປັນສະຕຣິງ', [
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 400 ຕົວອັກສອນ.'),
  ]),
  media: string('ຕ້ອງເປັນສະຕຣິງ'),
//   media: special(
//     (input) => input instanceof MemoryStoredFile,
//     'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
//     [
//       custom(
//         (input: MemoryStoredFile) =>
//           ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'].includes(
//             input.mimeType,
//           ),
//         'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
//       ),
//       custom(
//         (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 5,
//         'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 5 MB.',
//       ),
//     ],
//   ),
});

type CreateFeedbackDtoType = Output<typeof CreateFeedbackDto>;

export { CreateFeedbackDto, CreateFeedbackDtoType };
