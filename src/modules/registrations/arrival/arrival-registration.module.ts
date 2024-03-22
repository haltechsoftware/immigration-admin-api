import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import reportRegisterHandlers from './queries/handlers';

@Module({
    providers: [...reportRegisterHandlers],
    controllers:[ArrivalRegistrationController],
})
export class ArrivalRegistrationModule {}
