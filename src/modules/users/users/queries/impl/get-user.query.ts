import { IOffsetBasePaginate } from 'src/common/interface/pagination/pagination.interface';
import { User } from 'src/modules/users/entities';

export default class GetUserQuery {
  constructor(public readonly paginate: IOffsetBasePaginate<User>) {}
}
