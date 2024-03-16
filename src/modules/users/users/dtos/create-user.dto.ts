import { MemoryStoredFile } from 'nestjs-form-data';
import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  Output,
  custom,
  customAsync,
  email,
  maxLength,
  minLength,
  objectAsync,
  optional,
  special,
  string,
  stringAsync,
  transformAsync,
} from 'valibot';

const CreateUserDto = objectAsync({
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
  email: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    email('ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ.'),
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.users.findFirst({
        where: ({ email }, { eq }) => eq(email, input),
      });

      return res ? false : true;
    }, 'ອີເມວນີ້ມີໃນລະບົບແລ້ວ'),
  ]),
  password: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(8, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ.'),
  ]),
  role_ids: transformAsync(
    stringAsync([
      customAsync(async (input) => {
        const drizzle: DrizzleService =
          RequestContext.currentContext.req.drizzle;

        if (!input) return true;

        const ids = input.split(',').map((val) => Number(val));

        const res = await drizzle.db().query.roles.findMany({
          where: ({ id }, { inArray }) => inArray(id, ids),
        });

        return res.length === ids.length;
      }, 'ບົດບາດບາງລາຍການບໍ່ມີໃນລະບົບ'),
      customAsync(async (input) => {
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
