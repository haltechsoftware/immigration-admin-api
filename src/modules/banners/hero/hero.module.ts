import { Module } from '@nestjs/common';
import { BannerHeroController } from './banner.controller';
import { BannerRepository } from './banner.repository';
import { bannerHandler } from './commands/handlers';
import { bannerQueryHandler } from './queries/handlers';

@Module({
    controllers: [BannerHeroController],
    providers: [
        ...bannerHandler,
        ...bannerQueryHandler,
        BannerRepository
    ]
})
export class HeroModule {}
