import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import authHandlers from './commands/handlers';
import { AuthRepository } from './repositories/auth.repository';
import { LoginAttemptService } from './services/login-attempt.service';

@Module({
  controllers: [AuthController],
  providers: [...authHandlers, AuthRepository, LoginAttemptService],
  exports: [AuthRepository],
})
export class AuthModule {}
