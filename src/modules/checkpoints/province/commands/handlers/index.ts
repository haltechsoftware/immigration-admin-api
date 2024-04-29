import { Provider } from "@nestjs/common";
import { CreateProvinceHandler } from "./create-province.handler";
import { UpdateProvinceHandler } from "./update-province.handler";
import { DeleteProvinceHandler } from "./delete.province.handler";

export const provinceHandler : Provider[] = [
    CreateProvinceHandler,
    UpdateProvinceHandler,
    DeleteProvinceHandler
]