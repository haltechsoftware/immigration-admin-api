import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output } from 'valibot';

const QueryGuestListDto = OffsetBasePaginateDto;

type QueryGuestListDtoType = Output<typeof QueryGuestListDto>;

export { QueryGuestListDto, type QueryGuestListDtoType };
