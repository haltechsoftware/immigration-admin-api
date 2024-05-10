import { Output, objectAsync, omitAsync } from 'valibot';
import { ProvinceTranslateDto } from './province-translate.dto';

const CreateProvinceDto = objectAsync({
  lo: omitAsync(ProvinceTranslateDto, ['id']),
  en: omitAsync(ProvinceTranslateDto, ['id']),
  zh_cn: omitAsync(ProvinceTranslateDto, ['id']),
});

type CreateProvinceDtoType = Output<typeof CreateProvinceDto>;

export { CreateProvinceDto, CreateProvinceDtoType };
