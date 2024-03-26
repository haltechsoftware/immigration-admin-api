import { Provider } from "@nestjs/common";
import { GetAllBannerQueryHandler } from "./get-all.banner";
import { GetOneBannerQueryHandler } from "./get-one.banner";

export const bannerQueryHandler : Provider[] = [
    GetAllBannerQueryHandler,
    GetOneBannerQueryHandler
]