import { ArrivalRegistrationModule } from './arrival/arrival-registration.module';
import { DepartureRegistrationModule } from './departure/departure-registration.module';
import { NoOfTouristsModule } from './number-of-registrations/tourists/no-of-tourists.module';

export const registrationModules = [
  ArrivalRegistrationModule,
  DepartureRegistrationModule,
  NoOfTouristsModule,
];
