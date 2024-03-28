import { CreateBannerHeroType } from '../../dtos/create-banner.dto';

export class CreateBannerCommand {
  constructor(public readonly input: CreateBannerHeroType) {}
}
