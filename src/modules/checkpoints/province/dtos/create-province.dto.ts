import { Output, objectAsync, omitAsync } from "valibot";
import { ProvinceTranslateSchema } from "./province-translate.schema";

const CreateProvinceDto = objectAsync({
    lo: omitAsync(ProvinceTranslateSchema, ['id']),
    en: omitAsync(ProvinceTranslateSchema, ['id']),
    zh_cn: omitAsync(ProvinceTranslateSchema, ['id']),
  });
  
  type CreateProvinceDtoType = Output<typeof CreateProvinceDto>;
  
  export { CreateProvinceDto, CreateProvinceDtoType };