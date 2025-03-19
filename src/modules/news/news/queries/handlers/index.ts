import { Provider } from "@nestjs/common";
import { GetNewsOffsetBasePaginateHandler } from "./get-news-offset-base-paginate.repository";
import { GetNewsDetailHandler } from "./get-news-detail.repository";
import { GetNewsOffsetBasePaginateClientHandler } from "./get-news-client-offset-base-paginate.repository";
import { GetNewsClientOffsetBasePaginateHandler } from "./get-new-clinet-paginate.repository";
import { GetNewCategoryOffsetBasePaginateClientQueryHandler } from "./get-new-category-client-paginate.repository";
import { GetNewsDetailClientHandler } from "./get-new-detail.client.repositoy";

export const newsQueryHandlers : Provider[] = [
    GetNewCategoryOffsetBasePaginateClientQueryHandler,
    GetNewsOffsetBasePaginateClientHandler,
    GetNewsClientOffsetBasePaginateHandler,
    GetNewsOffsetBasePaginateHandler,
    GetNewsDetailClientHandler,
    GetNewsDetailHandler,
]