import { Module } from '@nestjs/common';
import userCommandHandlers from './commands/handlers';
import userQueryHandlers from './queries/handlers';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  providers: [...userCommandHandlers, ...userQueryHandlers, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
