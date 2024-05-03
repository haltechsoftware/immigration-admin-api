import { Provider } from "@nestjs/common";
import { CreateNewsCategoryHandler } from "./create-news-category.handler";
import { UpdateNewsCategoryHandler } from "./update-news-category.handler";
import { RemoveNewsCategoryHandler } from "./remove-news-category.handler";

export const newsCategoryHandler : Provider[] = [
    CreateNewsCategoryHandler,
    UpdateNewsCategoryHandler,
    RemoveNewsCategoryHandler
]