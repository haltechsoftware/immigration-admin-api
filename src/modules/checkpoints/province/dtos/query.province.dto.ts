import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output } from 'valibot';

const QueryProvinceDto = OffsetBasePaginateDto;

type QueryProvinceDtoType = Output<typeof QueryProvinceDto>;

export { QueryProvinceDto, QueryProvinceDtoType };
