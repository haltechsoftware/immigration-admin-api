import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import { ArrivalRegistrationRepository } from './arrival-registration.repository';
import { arrivalCommandHandlers } from './commands/handlers';
import arrivalRegisterHandlers from './queries/handlers';
import { CountryRepository } from 'src/modules/checkpoints/country/country.repository';

@Module({
  providers: [
    ...arrivalRegisterHandlers,
    ...arrivalCommandHandlers,
    ArrivalRegistrationRepository,
    CountryRepository
  ],
  controllers: [ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
