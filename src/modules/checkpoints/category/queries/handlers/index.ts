import { Provider } from "@nestjs/common";
import { QueryGetAllCheckpointCategoryHandler } from "./get-all";
import { QueryGetOneCheckpointCategoryHandler } from "./get-one";

export const queryCheckpointCategoryHandler: Provider[] = [
    QueryGetAllCheckpointCategoryHandler,
    QueryGetOneCheckpointCategoryHandler
]