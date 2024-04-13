import { format } from 'date-fns';
import { Output, object, optional, string, transform } from 'valibot';
import { DateTimeFormat } from '../enum/date-time-fomat.enum';

const CursorBasePaginateDto = object({
  cursor: optional(
    transform(string(), (input) => {
      if (input) return format(input, DateTimeFormat.Timestamp);
      return undefined;
    }),
  ),
  limit: optional(
    transform(string(), (input) => {
      if (input) return Number(input);
    }),
  ),
});

type CursorBasePaginateDtoType = Output<typeof CursorBasePaginateDto>;

export { CursorBasePaginateDto, type CursorBasePaginateDtoType };
