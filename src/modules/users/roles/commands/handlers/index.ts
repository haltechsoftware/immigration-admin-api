import { CreateRoleHandler } from './create-role.handler';
import { DeleteRoleHandler } from './delete-role.handler';
import { UpdateRoleHandler } from './update-role.handler';

export const roleCommandHandlers = [
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
];
