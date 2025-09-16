import { Module } from '@nestjs/common';
import { ArrivalRegistrationController } from './arrival-registration.controller';
import { ArrivalRegistrationRepository } from './arrival-registration.repository';
import { arrivalCommandHandlers } from './commands/handlers';
import arrivalRegisterHandlers from './queries/handlers';
import { CountryRepository } from 'src/modules/checkpoints/country/country.repository';
import { GoogleRecaptchaGuard } from 'src/common/guards/recaptcha.guard';
import { GoogleRecaptchaService } from 'src/common/google-recaptcha/recaptcha.service';
import { HttpModule } from '@nestjs/axios';
import { ReportArrivalRegistrationController } from './report.controller';
import { ReportArrivalService } from './report.service';

@Module({
  imports: [HttpModule],
  providers: [
    GoogleRecaptchaGuard,
    GoogleRecaptchaService,
    ...arrivalRegisterHandlers,
    ...arrivalCommandHandlers,
    ArrivalRegistrationRepository,
    CountryRepository,
    ReportArrivalService,
  ],
  controllers: [
    ArrivalRegistrationController,
    ReportArrivalRegistrationController,
  ],
})
export class ArrivalRegistrationModule {}
