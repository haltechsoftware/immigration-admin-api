import { Output } from 'valibot';
import { UploadVisaImageDto } from '../../dtos/upload-visa-image.dto';

export class UploadVisaImageCommand {
  constructor(public dto: Output<typeof UploadVisaImageDto>) {}
}
