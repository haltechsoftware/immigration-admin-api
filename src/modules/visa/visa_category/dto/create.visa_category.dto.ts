import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  maxLength,
  minLength,
  object,
  string,
} from 'valibot';

const CreateVisaCategoryDto = object({
    lo_name:string('ຈະຕ້ອງເປັນ string', [
        minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    ]),
    en_name: string('ຈະຕ້ອງເປັນ string.', [
        minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
        maxLength(1000, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 1000 ຕົວອັກສອນ.'),
    ]),
    zh_name: string('ຈະຕ້ອງເປັນ string.', [
        minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
        maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
    ]),
    lo_content: string('ຈະຕ້ອງເປັນ string.', [
        minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    ]),
    en_content: string('ຈະຕ້ອງເປັນ string.', [
        minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    ]),
    zh_content: string('ຈະຕ້ອງເປັນ string.', [
        minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    ]),
});

type CreateVisaCategoryDtoType = Output<typeof CreateVisaCategoryDto>;

export { CreateVisaCategoryDto, type CreateVisaCategoryDtoType };
