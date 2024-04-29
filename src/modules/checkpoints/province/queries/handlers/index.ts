import { Provider } from "@nestjs/common";
import { QueryGetAllProvinceHandler } from "./get-all.province";
import { QueryGetOneProvinceHandler } from "./get-one.province";

export const queryProvinceHandler : Provider[] = [
    QueryGetAllProvinceHandler,
    QueryGetOneProvinceHandler
]