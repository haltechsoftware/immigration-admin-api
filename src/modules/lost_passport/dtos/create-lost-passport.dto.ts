import { Output, object, omit } from 'valibot';
import { LostPassportTranslateSchema } from './lost-passport-translate.schema';

const CreateLostPassportDto = object({
  lo: omit(LostPassportTranslateSchema, ['id']),
  en: omit(LostPassportTranslateSchema, ['id']),
  zh_cn: omit(LostPassportTranslateSchema, ['id']),
});

type CreateLostPassportDtoType = Output<typeof CreateLostPassportDto>;

export { CreateLostPassportDto, CreateLostPassportDtoType };
