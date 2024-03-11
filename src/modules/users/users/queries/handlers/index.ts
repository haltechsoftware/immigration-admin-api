import { GetUserByIdHandler } from './get-user-by-id.repository';
import { GetUserHandler } from './get-user.repository';

const userQueryHandlers = [GetUserHandler, GetUserByIdHandler];

export default userQueryHandlers;
