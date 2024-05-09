import { ScanArrivalCodeHandler } from './scan-arrival-code.handler';
import { UploadPassportImageHandler } from './upload-passport-image.handler';
import { UploadVisaImageHandler } from './upload-visa-image.handler';
import { VerifyArrivalCodeHandler } from './verify-code-arrival.repository';

export const arrivalCommandHandlers = [
  VerifyArrivalCodeHandler,
  UploadPassportImageHandler,
  UploadVisaImageHandler,
  ScanArrivalCodeHandler,
];
