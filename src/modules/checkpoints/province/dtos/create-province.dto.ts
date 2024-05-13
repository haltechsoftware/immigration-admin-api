import { Output, array, number, object, omit } from 'valibot';
import { ProvinceTranslateDto } from './province-translate.dto';

const CreateProvinceDto = object({
  country_ids: array(number()),
  lo: omit(ProvinceTranslateDto, ['id']),
  en: omit(ProvinceTranslateDto, ['id']),
  zh_cn: omit(ProvinceTranslateDto, ['id']),
});

type CreateProvinceDtoType = Output<typeof CreateProvinceDto>;

export { CreateProvinceDto, CreateProvinceDtoType };
