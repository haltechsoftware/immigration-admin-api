import { IOffsetBasePaginate } from 'src/common/interface/pagination/pagination.interface';
import { Role } from 'src/modules/users/entities';

export default class GetRoleQuery {
  constructor(public readonly paginate: IOffsetBasePaginate<Role>) {}
}
