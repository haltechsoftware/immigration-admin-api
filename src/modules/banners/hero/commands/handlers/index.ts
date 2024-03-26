import { Provider } from '@nestjs/common';
import { CreateBannerHandler } from './create-banner.handler';
import { PrivateBannerHandler } from './private-banner.handler';
import { PublicBannerHandler } from './public-banner.handler';
import { RemoveBannerHandler } from './remove-banner.handler';
import { UpdateBannerHandler } from './update-banner.handler';

export const bannerHandler: Provider[] = [
  CreateBannerHandler,
  UpdateBannerHandler,
  PublicBannerHandler,
  PrivateBannerHandler,
  RemoveBannerHandler,
];
