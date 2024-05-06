import { IOffsetBasePaginate } from 'src/common/interface/pagination/pagination.interface';
import { Law } from 'src/modules/laws/entities';

export default class GetLawQuery {
  constructor(public readonly paginate: IOffsetBasePaginate<Law>) {}
}
