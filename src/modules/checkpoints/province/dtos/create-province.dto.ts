import { Output, array, object, omit, string } from 'valibot';
import { ProvinceTranslateDto } from './province-translate.dto';

const CreateProvinceDto = object({
  countries: array(string()),
  lo: omit(ProvinceTranslateDto, ['id']),
  en: omit(ProvinceTranslateDto, ['id']),
  zh_cn: omit(ProvinceTranslateDto, ['id']),
});

type CreateProvinceDtoType = Output<typeof CreateProvinceDto>;

export { CreateProvinceDto, CreateProvinceDtoType };
