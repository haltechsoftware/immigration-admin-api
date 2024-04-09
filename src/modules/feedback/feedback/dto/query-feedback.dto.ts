import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, special } from 'valibot';

const QueryFeedbackDto = merge([
  OffsetBasePaginateDto,
  object({
    is_published: optional(
      special<'0' | '1'>((input) => input === '0' || input === '1'),
    ),
  }),
]);

type QueryFeedbackDtoType = Output<typeof QueryFeedbackDto>;

export { QueryFeedbackDto, type QueryFeedbackDtoType };
