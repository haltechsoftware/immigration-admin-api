import { OffsetBasePaginateDtoType } from 'src/common/dtos/offset-base-paginate.dto';


export class GetNewsOffsetBasePaginateClientQuery {
  constructor(public readonly paginate: OffsetBasePaginateDtoType) {}
}