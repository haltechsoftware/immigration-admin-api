import { UploadPassportImageHandler } from './upload-passport-image.handler';
import { UploadVisaImageHandler } from './upload-visa-image.handler';

const arrivalCommandHandlers = [
  UploadPassportImageHandler,
  UploadVisaImageHandler,
];

export default arrivalCommandHandlers;
