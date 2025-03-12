import { ArrivalRegistrationModule } from './arrival/arrival-registration.module';
import { DepartureRegistrationModule } from './departure/departure-registration.module';
import { NoOfRegisterModule } from './number-of-registrations/register/no-of-register.module';
import { NoOfTouristsModule } from './number-of-registrations/tourists/no-of-tourists.module';
import { VisitorModule } from './number-of-registrations/visitor/visitor.module';

export const registrationModules = [
  ArrivalRegistrationModule,
  DepartureRegistrationModule,
  NoOfTouristsModule,
  NoOfRegisterModule,
  VisitorModule
];
