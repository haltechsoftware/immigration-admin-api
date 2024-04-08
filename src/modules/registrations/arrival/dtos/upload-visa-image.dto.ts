import { merge, object, omit, string } from 'valibot';
import { UploadPassportImageDto } from './upload-passport-image.dto';

export const UploadVisaImageDto = merge([
  omit(UploadPassportImageDto, ['passport_number']),
  object({ visa_number: string() }),
]);
