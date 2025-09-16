import { Module } from '@nestjs/common';
import { departureCommandHandlers } from './commands/handlers';
import { DepartureRegistrationController } from './departure-registration.controller';
import { DepartureRepository } from './departure-registration.repository';
import departureRegisterHandlers from './queries/handlers';
import { ReportArrivalRegistrationController } from './report.controller';
import { ReportDepartureService } from './report.service';

@Module({
  providers: [
    ...departureRegisterHandlers,
    ...departureCommandHandlers,
    DepartureRepository,
    ReportDepartureService,
  ],
  controllers: [
    DepartureRegistrationController,
    ReportArrivalRegistrationController,
  ],
})
export class DepartureRegistrationModule {}
