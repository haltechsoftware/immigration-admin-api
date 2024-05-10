import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output } from 'valibot';

const QueryCheckpointCategoryDto = OffsetBasePaginateDto;

type QueryCheckpointCategoryDtoType = Output<typeof QueryCheckpointCategoryDto>;

export { QueryCheckpointCategoryDto, QueryCheckpointCategoryDtoType };
