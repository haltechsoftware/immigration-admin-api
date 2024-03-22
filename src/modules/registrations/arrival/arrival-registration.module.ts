import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import arrivalRegisterHandlers from './queries/handlers';

@Module({
    providers: [...arrivalRegisterHandlers],
    controllers:[ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
