import { Module } from '@nestjs/common';
import departureRegisterHandlers from './queries/handlers';
import { DepartureRegistrationController } from './departure-registration.controller';

@Module({
    providers: [...departureRegisterHandlers],
    controllers: [DepartureRegistrationController]
})
export class DepartureRegistrationModule {}
