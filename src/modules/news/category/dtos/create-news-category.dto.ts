import { Output, object, omit } from 'valibot';
import { NewTranslateDto } from './new_translate.dto';

const CreateNewsCategoryDto = object({
  en: omit(NewTranslateDto, ['id']),
  lo: omit(NewTranslateDto, ['id']),
  zh_cn: omit(NewTranslateDto, ['id']),
});

type CreateNewsCategoryDtoType = Output<typeof CreateNewsCategoryDto>;

export { CreateNewsCategoryDto, CreateNewsCategoryDtoType };
