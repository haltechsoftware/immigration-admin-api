
import {
    Output,
    email,
    maxLength,
    minLength,
    object,
    string,
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
});

type CreateFeedbackDtoType = Output<typeof CreateFeedbackDto>;

export { CreateFeedbackDto, CreateFeedbackDtoType };
