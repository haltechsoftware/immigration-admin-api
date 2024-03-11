import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import authHandlers from './commands/handlers';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  controllers: [AuthController],
  providers: [...authHandlers, AuthRepository],
  exports: [AuthRepository],
})
export class AuthModule {}
