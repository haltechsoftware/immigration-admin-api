import { Provider } from '@nestjs/common';
import { GetDetailLostPassportHandler } from './get-detail-lost-passport.repository';
import { GetLostPassportByIdHandler } from './get-lost-passport-by-id.repository';
import { GetPaginateLostPassportHandler } from './get-paginate-lost-passport.repository';

export const lostPassportQuery: Provider[] = [
  GetDetailLostPassportHandler,
  GetLostPassportByIdHandler,
  GetPaginateLostPassportHandler,
];
