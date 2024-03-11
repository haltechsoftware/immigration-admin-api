import CreateUserHandler from './create-user.handler';
import DeleteUserHandler from './delete-user.handler';
import UpdateUserHandler from './update-user.handler';

const userCommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

export default userCommandHandlers;
