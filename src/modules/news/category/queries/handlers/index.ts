import { Provider } from "@nestjs/common";
import { GetCategoryOffsetBasePaginateQueryHandler } from "./news-category-get-paginate.repository";
import { GetCategoryByIdHandler } from "./news-category-get-by-id.repository";

export const newCategoryQuery : Provider[] = [
    GetCategoryOffsetBasePaginateQueryHandler,
    GetCategoryByIdHandler
]