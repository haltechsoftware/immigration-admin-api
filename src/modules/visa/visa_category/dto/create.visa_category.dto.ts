import { Output, object, omit } from 'valibot';
import { VisaCategoryTranslateDto } from './visa-category-translate.dto';

const CreateVisaCategoryDto = object({
  lo: omit(VisaCategoryTranslateDto, ['id']),
  en: omit(VisaCategoryTranslateDto, ['id']),
  zh_cn: omit(VisaCategoryTranslateDto, ['id']),
});

type CreateVisaCategoryDtoType = Output<typeof CreateVisaCategoryDto>;

export { CreateVisaCategoryDto, type CreateVisaCategoryDtoType };
