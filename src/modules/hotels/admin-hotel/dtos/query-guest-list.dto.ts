import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { custom, merge, object, optional, Output, string } from 'valibot';

const QueryGuestListDto = merge([
  OffsetBasePaginateDto,
  object({
    room_no: optional(string()),
    check_in: optional(
      string([
        custom((input) => {
          if (input) {
            return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input);
          } else {
            return true;
          }
        }),
      ]),
    ),
    check_out: optional(
      string([
        custom((input) => {
          if (input) {
            return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input);
          } else {
            return true;
          }
        }),
      ]),
    ),
  }),
]);

type QueryGuestListDtoType = Output<typeof QueryGuestListDto>;

export { QueryGuestListDto, type QueryGuestListDtoType };
