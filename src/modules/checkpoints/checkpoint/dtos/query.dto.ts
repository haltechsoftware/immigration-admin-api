import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, string, transform } from 'valibot';

const QueryCheckpointDto = merge([
  object({
    category_id: transform(optional(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ')), (input) =>
      input ? Number(input) : 0,
    ),
    province_id: transform(optional(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ')), (input) =>
      input ? Number(input) : 0,
    ),
  }),
  OffsetBasePaginateDto,
]);

type QueryCheckpointDtoType = Output<typeof QueryCheckpointDto>;

export { QueryCheckpointDto, QueryCheckpointDtoType };
