import { Provider } from '@nestjs/common';
import { CreateLostPassportHandler } from './create-lost-passport.handler';
import { DeletedLostPassportHandler } from './remove-lost-passport.handler';
import { UpdatedLostPassportHandler } from './update-lost-passport.handler';

export const lostPassportHandlers: Provider[] = [
  CreateLostPassportHandler,
  UpdatedLostPassportHandler,
  DeletedLostPassportHandler,
];
