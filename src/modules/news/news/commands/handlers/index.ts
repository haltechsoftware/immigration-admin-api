import { Provider } from "@nestjs/common";
import { CreateNewsHandler } from "./create-news.handler";
import { RemoveNewsHandler } from "./remove-news.handler";
import { UpdateNewsCategoryHandler } from "./update-news.handler";

export const newsHandler : Provider[] = [
    CreateNewsHandler,
    RemoveNewsHandler,
    UpdateNewsCategoryHandler
]