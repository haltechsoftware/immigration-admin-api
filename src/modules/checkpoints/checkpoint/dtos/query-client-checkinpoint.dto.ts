import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import {
  Output,
  merge,
  object,
  optional,
  partial,
  string,
  transform,
} from 'valibot';

const QueryclientCheckpointDto = merge([
  object({
    category_id: transform(optional(string('ບໍ່ຕ້ອງຫວ່າງເປົ່າ')), (input) =>
      input ? Number(input) : 0,
    ),
  }),
  partial(LanguageDto),
  OffsetBasePaginateDto,
]);

type QueryClientCheckpointDtoType = Output<typeof QueryclientCheckpointDto>;

export { QueryclientCheckpointDto, QueryClientCheckpointDtoType };
