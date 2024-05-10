import { Output, object } from 'valibot';
import { ProvinceTranslateDto } from './province-translate.dto';

const UpdateProvinceDto = object({
  lo: ProvinceTranslateDto,
  en: ProvinceTranslateDto,
  zh_cn: ProvinceTranslateDto,
});

type UpdateProvinceDtoType = Output<typeof UpdateProvinceDto>;

export { UpdateProvinceDto, UpdateProvinceDtoType };
