import CreateNationalityHandler from './create.handler';
import { RemoveNationalityHandler } from './delete.handler';
import { UpdateNationalityHandler } from './udpate.handler';

const nationalityCommandHandlers = [
  CreateNationalityHandler,
  UpdateNationalityHandler,
  RemoveNationalityHandler,
];

export default nationalityCommandHandlers;
