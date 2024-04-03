import { Module } from '@nestjs/common';
import departureRegisterHandlers from './queries/handlers';
import { DepartureRegistrationController } from './departure-registration.controller';
import { VerifyCodeRepository } from './departure-registration.reppository';

@Module({
  providers: [...departureRegisterHandlers, VerifyCodeRepository],
  controllers: [DepartureRegistrationController],
})
export class DepartureRegistrationModule {}
