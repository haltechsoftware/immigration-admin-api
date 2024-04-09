import { Module } from '@nestjs/common';
import { departureCommandHandlers } from './commands/handlers';
import { DepartureRegistrationController } from './departure-registration.controller';
import { DepartureRepository } from './departure-registration.repository';
import departureRegisterHandlers from './queries/handlers';

@Module({
  providers: [
    ...departureRegisterHandlers,
    ...departureCommandHandlers,
    DepartureRepository,
  ],
  controllers: [DepartureRegistrationController],
})
export class DepartureRegistrationModule {}
