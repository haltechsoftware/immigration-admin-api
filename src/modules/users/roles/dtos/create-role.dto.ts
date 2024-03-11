import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  Output,
  arrayAsync,
  customAsync,
  maxLength,
  minLength,
  number,
  objectAsync,
  optional,
  string,
} from 'valibot';

const CreateRoleDto = objectAsync({
  name: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 3 ຕົວອັກສອນ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  description: optional(string('ຈະຕ້ອງເປັນຕົວອັກສອນ.')),
  permission_ids: arrayAsync(number('ຕ້ອງເປັນຕົວເລກ.'), [
    customAsync(async (input) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.permissions.findMany({
        where: ({ id }, { inArray }) => inArray(id, input),
      });

      return res.length === input.length;
    }, 'ຂໍ້ມຼນການອະນຸຍາດບາງລາຍການບໍ່ມີໃນລະບົບ'),
  ]),
});

type CreateRoleDtoType = Output<typeof CreateRoleDto>;

export { CreateRoleDto, CreateRoleDtoType };
