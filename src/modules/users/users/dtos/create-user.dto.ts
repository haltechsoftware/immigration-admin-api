import { MemoryStoredFile } from 'nestjs-form-data';
import {
  Output,
  custom,
  email,
  maxLength,
  minLength,
  object,
  optional,
  special,
  string,
  transform,
} from 'valibot';

const CreateUserDto = object({
  first_name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  last_name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  image: optional(
    special((input) => input instanceof MemoryStoredFile, 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ', [
      custom(
        (input: MemoryStoredFile) =>
          ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
        'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
      ),
    ]),
  ),
  email: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    email('ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ.'),
  ]),
  password: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(8, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ.'),
  ]),
  role_ids: transform(
    string([
      custom((input) => {
        if (!input) return true;

        return /^\d+(,\d+)*$/.test(input);
      }, 'ຮູບແບບຂໍ້ມູນຕ້ອງເປັນ 1,2,n..'),
    ]),
    (input) => {
      if (!input) return [];

      return input.split(',').map((val) => Number(val));
    },
  ),
});

type CreateUserDtoType = Output<typeof CreateUserDto>;

export { CreateUserDto, type CreateUserDtoType };
