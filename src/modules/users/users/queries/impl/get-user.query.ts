import { IOffsetBasePaginate } from 'src/common/interface/pagination/pagination.interface';
import { User } from '../../entities';

export default class GetUserQuery {
  constructor(public readonly paginate: IOffsetBasePaginate<User>) {}
}
