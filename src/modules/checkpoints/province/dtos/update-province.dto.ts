import { Output, merge, object, omit } from 'valibot';
import { CreateProvinceDto } from './create-province.dto';
import { ProvinceTranslateDto } from './province-translate.dto';

const UpdateProvinceDto = merge([
  omit(CreateProvinceDto, ['lo', 'en', 'zh_cn']),
  object({
    lo: ProvinceTranslateDto,
    en: ProvinceTranslateDto,
    zh_cn: ProvinceTranslateDto,
  }),
]);

type UpdateProvinceDtoType = Output<typeof UpdateProvinceDto>;

export { UpdateProvinceDto, UpdateProvinceDtoType };
