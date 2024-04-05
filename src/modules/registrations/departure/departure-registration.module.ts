import { Module } from '@nestjs/common';
import departureRegisterHandlers from './queries/handlers';
import { DepartureRegistrationController } from './departure-registration.controller';
import { VerifyCodeRepository } from './departure-registration.reppository';
import { departureCommandHandlers } from './commands/handlers';

@Module({
  providers: [
    ...departureRegisterHandlers,
    ...departureCommandHandlers,
    VerifyCodeRepository,
  ],
  controllers: [DepartureRegistrationController],
})
export class DepartureRegistrationModule {}
