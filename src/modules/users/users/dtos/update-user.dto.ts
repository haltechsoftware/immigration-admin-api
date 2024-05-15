import {
  Output,
  merge,
  minLength,
  object,
  omit,
  optional,
  string,
} from 'valibot';
import { CreateUserDto } from './create-user.dto';

const UpdateUserDto = merge([
  omit(CreateUserDto, ['password']),
  object({
    password: optional(
      string([minLength(8, 'ຄວາມຍາວຕໍ່າສຸດທີ່ຕ້ອງການແມ່ນ 8 ຕົວອັກສອນ.')]),
    ),
  }),
]);

type UpdateUserDtoType = Output<typeof UpdateUserDto>;

export { UpdateUserDto, type UpdateUserDtoType };
