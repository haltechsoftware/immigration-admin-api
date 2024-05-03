import { Output, object } from 'valibot';
import { NewTranslateDto } from './new_translate.dto';

const UpdateNewsCategoryDto = object({
  en: NewTranslateDto,
  lo: NewTranslateDto,
  zh_cn: NewTranslateDto,
});

type UpdateNewsCategoryDtoType = Output<typeof UpdateNewsCategoryDto>;

export { UpdateNewsCategoryDto, UpdateNewsCategoryDtoType };
