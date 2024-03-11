import { UpdateRoleDtoType } from '../../dtos/update-role.dto';

export default class UpdateRoleCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateRoleDtoType,
  ) {}
}
