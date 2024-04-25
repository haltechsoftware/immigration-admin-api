import { Provider } from "@nestjs/common";
import { CreateProvinceHandler } from "./create-province.handler";

export const provinceHandler : Provider[] = [
    CreateProvinceHandler
]