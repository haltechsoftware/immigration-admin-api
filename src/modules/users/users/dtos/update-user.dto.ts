import { MemoryStoredFile } from 'nestjs-form-data';
import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  Output,
  custom,
  customAsync,
  email,
  mergeAsync,
  minLength,
  objectAsync,
  omitAsync,
  optional,
  special,
  string,
  stringAsync,
} from 'valibot';
import { CreateUserDto } from './create-user.dto';

const UpdateUserDto = mergeAsync([
  omitAsync(CreateUserDto, ['password', 'email', 'image']),
  objectAsync({
    email: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
      email('ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ.'),
      customAsync(async (input) => {
        const drizzle: DrizzleService =
          RequestContext.currentContext.req.drizzle;

        const res = await drizzle.db().query.users.findFirst({
          where: ({ email, id }, { eq, and, not }) =>
            and(
              eq(email, input),
              not(eq(id, Number(RequestContext.currentContext.req.params.id))),
            ),
        });

        return !res;
      }, 'ອີເມວນີ້ມີໃນລະບົບແລ້ວ'),
    ]),
    password: optional(
      string([minLength(8, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ.')]),
    ),
    image: optional(
      special(
        (input) => input instanceof MemoryStoredFile,
        'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
        [
          custom(
            (input: MemoryStoredFile) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(
                input.mimeType,
              ),
            'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
          ),
          custom(
            (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
            'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
          ),
        ],
      ),
    ),
  }),
]);

type UpdateUserDtoType = Output<typeof UpdateUserDto>;

export { UpdateUserDto, type UpdateUserDtoType };
