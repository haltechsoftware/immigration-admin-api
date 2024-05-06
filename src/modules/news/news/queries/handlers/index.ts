import { Provider } from "@nestjs/common";
import { GetNewsOffsetBasePaginateHandler } from "./get-news-offset-base-paginate.repository";
import { GetNewsDetailHandler } from "./get-news-detail.repository";

export const newsQueryHandlers : Provider[] = [
    GetNewsOffsetBasePaginateHandler,
    GetNewsDetailHandler
]