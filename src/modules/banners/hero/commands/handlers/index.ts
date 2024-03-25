import { Provider } from "@nestjs/common";
import { CreateBannerHandler } from "./create-banner.handler";
import { UpdateBannerHandler } from "./update-banner.handler";
import { PrivateFalseBannerHandler } from "./private-false-banner.handler";
import { PrivateTrueBannerHandler } from "./private-true.banner.handler";
import { RemoveBannerHandler } from "./remove.banner.handler";

export const bannerHandler : Provider[] = [
    CreateBannerHandler,
    UpdateBannerHandler,
    PrivateFalseBannerHandler,
    PrivateTrueBannerHandler,
    RemoveBannerHandler
]