import { Module } from '@nestjs/common';
import { ArrivalRepository } from './arriva-registration.repository';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import { ArrivalRegistrationRepository } from './arrival-registration.repository';
import { arrivalCommandHandlers } from './commands/handlers';
import arrivalRegisterHandlers from './queries/handlers';

@Module({
  providers: [
    ...arrivalRegisterHandlers,
    ...arrivalCommandHandlers,
    ArrivalRepository,
  ],
  controllers: [ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
