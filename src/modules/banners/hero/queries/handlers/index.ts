import { Provider } from "@nestjs/common";
import { GetAllBannerQueryHandler } from "./get-all.banner";
import { GetOneBannerQueryHandler } from "./get-one.banner";
import { GetAllClientBannerQueryHandler } from "./get-all-client-banner";

export const bannerQueryHandler : Provider[] = [
    GetAllBannerQueryHandler,
    GetOneBannerQueryHandler,
    GetAllClientBannerQueryHandler,
]