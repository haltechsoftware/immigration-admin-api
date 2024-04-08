import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import { ArrivalRegistrationRepository } from './arrival-registration.repository';
import { arrivalCommandHandlers } from './commands/handlers';
import arrivalRegisterHandlers from './queries/handlers';

@Module({
  providers: [
    ...arrivalRegisterHandlers,
    ...arrivalCommandHandlers,
    ArrivalRegistrationRepository,
  ],
  controllers: [ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
