import { Module } from '@nestjs/common';
import { departureCommandHandlers } from './commands/handlers';
import { DepartureRegistrationController } from './departure-registration.controller';
import { DepartureRepository } from './departure-registration.repository';
import departureRegisterHandlers from './queries/handlers';
import { ReportArrivalRegistrationController } from './report.controller';
import { ReportDepartureService } from './report.service';
import { NationalityRepository } from 'src/modules/nationality/nationality.repository';

@Module({
  providers: [
    ...departureRegisterHandlers,
    ...departureCommandHandlers,
    DepartureRepository,
    ReportDepartureService,
    NationalityRepository,
  ],
  controllers: [
    DepartureRegistrationController,
    ReportArrivalRegistrationController,
  ],
})
export class DepartureRegistrationModule {}
