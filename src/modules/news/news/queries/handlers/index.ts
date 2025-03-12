import { Provider } from "@nestjs/common";
import { GetNewsOffsetBasePaginateHandler } from "./get-news-offset-base-paginate.repository";
import { GetNewsDetailHandler } from "./get-news-detail.repository";
import { GetNewsOffsetBasePaginateClientHandler } from "./get-news-client-offset-base-paginate.repository";

export const newsQueryHandlers : Provider[] = [
    GetNewsOffsetBasePaginateClientHandler,
    GetNewsOffsetBasePaginateHandler,
    GetNewsDetailHandler
]