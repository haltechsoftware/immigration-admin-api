import { Output } from 'valibot';
import { UploadPassportImageDto } from '../../dtos/upload-passport-image.dto';

export class UploadPassportImageCommand {
  constructor(public dto: Output<typeof UploadPassportImageDto>) {}
}
