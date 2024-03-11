import { GetRoleByIdHandler } from './get-role-by-id.handler';
import { GetRoleHandler } from './get-role.handler';

const roleQueryHandlers = [GetRoleHandler, GetRoleByIdHandler];

export default roleQueryHandlers;
