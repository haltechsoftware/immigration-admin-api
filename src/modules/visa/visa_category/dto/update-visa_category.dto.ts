import { Output, object } from 'valibot';
import { VisaCategoryTranslateDto } from './visa-category-translate.dto';

const UpdateVisaCategoryDto = object({
  lo: VisaCategoryTranslateDto,
  en: VisaCategoryTranslateDto,
  zh_cn: VisaCategoryTranslateDto,
});

type UpdateVisaCategoryType = Output<typeof UpdateVisaCategoryDto>;
export { UpdateVisaCategoryDto, type UpdateVisaCategoryType };
