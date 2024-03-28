import { OffsetBasePaginateDto } from "src/common/dtos/offset-base-paginate.dto";
import { Output, merge, object, optional, string } from "valibot";

const QueryFeedbackDto = merge([
    OffsetBasePaginateDto,
    object({
      is_published: optional(string()),
    }),
  ]);
  
type QueryFeedbackDtoType = Output<typeof QueryFeedbackDto>;

export { QueryFeedbackDto, type QueryFeedbackDtoType };
  