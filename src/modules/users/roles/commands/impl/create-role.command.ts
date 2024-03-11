import { CreateRoleDtoType } from '../../dtos/create-role.dto';

export default class CreateRoleCommand {
  constructor(public readonly dto: CreateRoleDtoType) {}
}
