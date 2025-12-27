import { GetNationalityHandler } from './get-all.hanlder';
import { GetOneNationalityHandler } from './get-one.handler';

const nationalityQueryHandlers = [
  GetNationalityHandler,
  GetOneNationalityHandler,
];

export default nationalityQueryHandlers;
