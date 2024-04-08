import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import { ArrivalRegistrationRepository } from './arrival-registration.repository';
import arrivalCommandHandlers from './commands/handlers';
import arrivalRegisterHandlers from './queries/handlers';

@Module({
  providers: [
    ...arrivalCommandHandlers,
    ...arrivalRegisterHandlers,
    ArrivalRegistrationRepository,
  ],
  controllers: [ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
