import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import arrivalRegisterHandlers from './queries/handlers';
import { ArrivalRepository } from './arriva-registration.repository';

@Module({
  providers: [...arrivalRegisterHandlers, ArrivalRepository],
  controllers: [ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
