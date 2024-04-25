import { Output, objectAsync } from "valibot";
import { ProvinceTranslateSchema } from "./province-translate.schema";

const UpdateProvinceDto = objectAsync({
    lo: ProvinceTranslateSchema,
    en: ProvinceTranslateSchema,
    zh_cn: ProvinceTranslateSchema,
});

type UpdateProvinceDtoType = Output<typeof UpdateProvinceDto>;

export { UpdateProvinceDto, UpdateProvinceDtoType };